import { redisClient } from "../Cache/User_Cache";
import geolib from 'geolib';
import { v4 as uuidv4 } from 'uuid';
import RescueMissionHistory from "../Models/RescueMissionHistory";
import user from "../models/user";


export const requestRescue = async (req, res) => {
    try {
        const { coordinates, radius, maxVolunteers, guestInfo } = req.body;
        const userId = req.user?._id;

        const missionId = uuidv4();

        // Save to Redis for fast access
        await redisClient.set(`rescue:${missionId}`, JSON.stringify({
            coordinates,
            radius,
            userId: userId || 'guest',
            guestInfo
        }), {
            EX: 600 // expires after 10 minutes
        });

        // Find volunteers from Redis (they update their realtime location)
        const allVolunteerKeys = await redisClient.keys('volunteer:*');
        const volunteers = [];
        for (const key of allVolunteerKeys) {
            const data = await redisClient.get(key);
            if (!data) continue;
            const parsed = JSON.parse(data);

            const distance = geolib.getDistance(
                { latitude: coordinates[1], longitude: coordinates[0] },
                { latitude: parsed.coordinates[1], longitude: parsed.coordinates[0] }
            );

            if (distance <= radius * 1000 && parsed.status === 'readyRescue') {
                volunteers.push({ ...parsed, distance });
            }
        }

        const sorted = volunteers.sort((a, b) => a.distance - b.distance).slice(0, maxVolunteers);

        const volunteerUsers = await user.find({ id: { $in: sorted.map(v => v.userId) } })
            .select('fullname phonenumber');

        // Save mission history
        await RescueMissionHistory.create({
            missionId,
            requester: userId || undefined,
            guestDetails: userId ? undefined : guestInfo,
            location: { type: 'Point', coordinates },
            radius,
            selectedVolunteers: volunteerUsers.map(v => v._id)
        });

        res.json({ volunteers: volunteerUsers });
    } catch (err) {
        console.error('Request Rescue Error:', err);
        res.status(500).json({ error: 'Server error during rescue request.' });
    }
};

export const requestToRescue = async (req, res) => {
    try {
        const { coordinates, radius, maxVolunteers = 5, guestInfo, autoAssign = true } = req.body;
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id') || null;
        const isGuest = !userId;

        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ error: 'Invalid coordinates format. Expected [longitude, latitude]' });
        }

        const missionId = uuidv4();

        // Save rescue request to Redis
        await redisClient.set(`rescue:${missionId}`, JSON.stringify({
            coordinates,
            radius,
            userId: isGuest ? 'guest' : userId,
            guestInfo: isGuest ? guestInfo : undefined
        }), {
            EX: 600
        });

        const volunteers = [];
        let cursor = '0';

        do {
            const result = await redisClient.scan(cursor, {
                MATCH: 'volunteer:*',
                COUNT: 100
            });

            cursor = result.cursor;
            const keys = result.keys;

            for (const key of keys) {
                const data = await redisClient.get(key);
                if (!data) continue;

                let parsed;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    console.warn(`Invalid JSON in Redis key ${key}`);
                    continue;
                }

                if (!parsed.coordinates || parsed.coordinates.length !== 2) continue;

                const distance = geolib.getDistance(
                    { latitude: coordinates[1], longitude: coordinates[0] },
                    { latitude: parsed.coordinates[1], longitude: parsed.coordinates[0] }
                );

                if (distance <= radius * 1000 && parsed.status === 'readyRescue') {
                    volunteers.push({ ...parsed, distance });
                }
            }
        } while (cursor !== '0');

        const sorted = volunteers
            .sort((a, b) => a.distance - b.distance)
            .slice(0, maxVolunteers);

        const volunteerUsers = await user.find({
            _id: { $in: sorted.map(v => v.userId) }
        }).select('fullname phonenumber');

        if (!autoAssign) {
            // Nếu user muốn tự chọn tình nguyện viên
            return res.json({
                selectVolunteers: true,
                volunteers: volunteerUsers,
                missionId
            });
        }

        // Tự động ghép: chọn người gần nhất
        const selectedVolunteerIds = volunteerUsers.map(v => v._id);

        await RescueMissionHistory.create({
            missionId,
            requester: isGuest ? undefined : userId,
            guestDetails: isGuest ? guestInfo : undefined,
            location: { type: 'Point', coordinates },
            radius,
            selectedVolunteers: selectedVolunteerIds
        });

        return res.json({ volunteers: volunteerUsers });

    } catch (err) {
        console.error('Request Rescue Error:', err);
        return res.status(500).json({ error: 'Server error during rescue request.' });
    }
};


export const confirmSelectedVolunteers = async (req, res) => {
    try {
        const { missionId, selectedVolunteerIds } = req.body;
        const userId = req.user?._id;

        // Validate
        if (!missionId || !Array.isArray(selectedVolunteerIds) || selectedVolunteerIds.length === 0) {
            return res.status(400).json({ error: 'missionId and selectedVolunteerIds are required' });
        }

        // Tìm nhiệm vụ cứu hộ
        const mission = await RescueMissionHistory.findOne({ missionId });
        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }

        if (mission.requester && mission.requester.toString() !== userId?.toString()) {
            return res.status(403).json({ error: 'Unauthorized to modify this mission' });
        }

        mission.selectedVolunteers = selectedVolunteerIds;
        await mission.save();

        const volunteerUsers = await user.find({
            _id: { $in: selectedVolunteerIds }
        }).select('fullname phonenumber');

        return res.json({
            message: 'Volunteers confirmed successfully',
            volunteers: volunteerUsers
        });

    } catch (err) {
        console.error('Confirm Selected Volunteers Error:', err);
        return res.status(500).json({ error: 'Server error during volunteer confirmation.' });
    }
};

export const acceptRescueMission = async (req, res) => {
    try {
        const { missionId } = req.params;
        const volunteerId = req.user._id;

        const mission = await RescueMissionHistory.findOne({ missionId }).populate('requester');

        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }

        if (mission.acceptedVolunteer) {
            return res.status(400).json({ error: 'Mission already accepted by another volunteer' });
        }

        const isSelected = mission.selectedVolunteers.some(
            v => v.toString() === volunteerId.toString()
        );
        if (!isSelected) {
            return res.status(403).json({ error: 'You are not selected for this mission' });
        }

        mission.acceptedVolunteer = volunteerId;
        mission.status = 'in_progress';
        mission.startedAt = new Date();
        await mission.save();

        // Tạo thông báo
        if (mission.requester) {
            await Notification.create({
                userId: mission.requester.toString(),
                type: 'success',
                title: 'Cứu hộ đã được xác nhận',
                message: 'Một tình nguyện viên đã xác nhận tham gia cứu hộ của bạn.'
            });
        }

        return res.json({ message: 'You have accepted the rescue mission.' });

    } catch (err) {
        console.error('Accept Rescue Mission Error:', err);
        return res.status(500).json({ error: 'Server error while accepting mission' });
    }
};



export const rejectRescueMission = async (req, res) => {
    try {
        const { missionId } = req.params;
        const volunteerId = req.user._id;

        const mission = await RescueMissionHistory.findOne({ missionId }).populate('requester');

        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }

        if (!mission.selectedVolunteers.includes(volunteerId)) {
            return res.status(403).json({ error: 'You are not selected for this mission' });
        }

        mission.selectedVolunteers = mission.selectedVolunteers.filter(
            v => v.toString() !== volunteerId.toString()
        );
        await mission.save();
        if (mission.requester) {
            await Notification.create({
                userId: mission.requester.toString(),
                type: 'warning',
                title: 'Tình nguyện viên đã từ chối',
                message: 'Một tình nguyện viên đã từ chối tham gia cứu hộ của bạn.'
            });
        }

        return res.json({ message: 'You have rejected the rescue mission.' });

    } catch (err) {
        console.error('Reject Rescue Mission Error:', err);
        return res.status(500).json({ error: 'Server error while rejecting mission' });
    }
};
