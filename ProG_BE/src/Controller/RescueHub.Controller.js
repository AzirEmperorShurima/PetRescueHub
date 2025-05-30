import { redisClient } from "../Config/redis.client.js";
import geolib from 'geolib';
import { v4 as uuidv4 } from 'uuid';
import { sendMailNotification } from "../services/sendMailService/nodeMailer.service.js";
import user from "../models/user.js";
import PetRescueMissionHistory from "../models/PetRescueMissionHistory.js";


export const requestRescue = async (req, res) => {
    try {
        const { coordinates, radius, maxVolunteers, guestInfo, timeoutMinutes = 30 } = req.body;
        const userId = req.user?._id;

        const missionId = uuidv4();

        // Tính thời gian timeout
        const timeoutAt = new Date(Date.now() + timeoutMinutes * 60 * 1000);

        await redisClient.set(`rescue:${missionId}`, JSON.stringify({
            coordinates,
            radius,
            userId: userId || 'guest',
            guestInfo,
            timeoutAt: timeoutAt.toISOString()
        }), {
            EX: timeoutMinutes * 60 // Thời gian hết hạn trong Redis cũng là timeoutMinutes
        });


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
        await PetRescueMissionHistory.create({
            missionId,
            requester: userId || undefined,
            guestDetails: userId ? undefined : guestInfo,
            location: { type: 'Point', coordinates },
            radius,
            selectedVolunteers: volunteerUsers.map(v => v._id),
            timeoutAt // Thêm thời gian timeout
        });

        res.json({ volunteers: volunteerUsers });
    } catch (err) {
        console.error('Request Rescue Error:', err);
        res.status(500).json({ error: 'Server error during rescue request.' });
    }
};

export const requestToRescue = async (req, res) => {
    try {
        const { coordinates, radius, maxVolunteers = 5, autoAssign = true, timeoutMinutes = 30 } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ error: 'Yêu cầu đăng nhập để sử dụng.' });
        }

        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ error: 'Định dạng tọa độ không hợp lệ. Cần [kinh độ, vĩ độ]' });
        }

        // Kiểm tra xem người dùng có nhiệm vụ đang hoạt động không
        const activeMissions = await PetRescueMissionHistory.find({
            requester: userId,
            status: { $in: ['pending', 'in_progress'] },
            timeoutAt: { $gt: new Date() }
        }).limit(1);

        if (activeMissions.length > 0) {
            return res.status(400).json({ error: 'Bạn đã có nhiệm vụ đang hoạt động. Vui lòng hoàn thành hoặc hủy nhiệm vụ hiện tại trước khi tạo mới.' });
        }

        const missionId = uuidv4();
        const timeoutAt = new Date(Date.now() + timeoutMinutes * 60 * 1000);

        // Lưu yêu cầu cứu hộ vào Redis
        await redisClient.set(
            `rescue:${missionId}`,
            JSON.stringify({
                coordinates,
                radius,
                userId,
                timeoutAt: timeoutAt.toISOString(),
            }),
            { EX: timeoutMinutes * 60 }
        );

        // Sử dụng GEORADIUS để tìm tình nguyện viên
        const [longitude, latitude] = coordinates;
        const volunteers = await redisClient.sendCommand([
            'GEORADIUS',
            'volunteers',
            longitude.toString(),
            latitude.toString(),
            `${radius}`,
            'km',
            'WITHCOORD',
            'COUNT',
            maxVolunteers.toString()
        ]);

        if (!volunteers || volunteers.length === 0) {
            console.log('Không tìm thấy tình nguyện viên trong bán kính', radius, 'km');
            return res.json({ volunteers: [] });
        }

        const volunteerIds = volunteers.map(item => item[0]); // Lấy các userId
        const volunteerUsers = await user.find({
            _id: { $in: volunteerIds }
        }).select('fullname phonenumber email');

        // Lọc các tình nguyện viên có trạng thái 'alreadyRescue'
        const filteredVolunteers = await Promise.all(volunteerUsers.map(async (user) => {
            const volunteerData = await redisClient.get(`volunteer:${user._id}`);
            if (volunteerData) {
                const parsedData = JSON.parse(volunteerData);
                return parsedData.status === 'alreadyRescue' ? user : null;
            }
            return null;
        })).then(results => results.filter(user => user !== null));

        if (filteredVolunteers.length === 0) {
            console.log('Không có tình nguyện viên nào ở trạng thái alreadyRescue');
            return res.json({ volunteers: [] });
        }

        if (!autoAssign) {
            await PetRescueMissionHistory.create({
                missionId,
                requester: userId,
                location: { type: 'Point', coordinates },
                radius,
                selectedVolunteers: [],
                acceptedVolunteer: null,
                timeoutAt,
                status: 'pending'
            });
            return res.json({
                selectVolunteers: true,
                volunteers: filteredVolunteers,
                missionId
            });
        }

        const selectedVolunteerIds = filteredVolunteers.map(v => v._id);
        const requester = await user.findById(userId).select('fullname');
        const acceptedVolunteer = filteredVolunteers[0];

        await PetRescueMissionHistory.create({
            missionId,
            requester: userId,
            location: { type: 'Point', coordinates },
            radius,
            selectedVolunteers: selectedVolunteerIds,
            acceptedVolunteer: acceptedVolunteer ? acceptedVolunteer._id : null,
            timeoutAt,
            status: 'pending'
        });

        if (acceptedVolunteer) {
            await sendMailNotification({
                email: acceptedVolunteer.email,
                subject: 'Yêu Cầu Cứu Hộ Mới',
                text: `Bạn đã được chọn cho một nhiệm vụ cứu hộ mới`,
                html: `
                    <p>Xin chào ${acceptedVolunteer.fullname},</p>
                    <p>Bạn đã được chọn cho một nhiệm vụ cứu hộ mới. Chi tiết nhiệm vụ:</p>
                    <ul>
                        <li>Mã nhiệm vụ: ${missionId}</li>
                        <li>Người yêu cầu: ${requester ? requester.fullname : 'Khách vãng lai'}</li>
                        <li>Vị trí: [${coordinates.join(', ')}]</li>
                    </ul>
                    <p>Vui lòng xác nhận hoặc từ chối nhiệm vụ trong hệ thống.</p>
                `
            });
        }

        return res.json({ volunteers: [acceptedVolunteer] || [] });
    } catch (err) {
        console.error('Lỗi yêu cầu cứu hộ:', err);
        return res.status(500).json({ error: 'Lỗi server khi xử lý yêu cầu cứu hộ.' });
    }
};


export const confirmSelectedVolunteers = async (req, res) => {
    try {
        const { missionId, selectedVolunteerIds } = req.body;
        const userId = req.user?._id;


        if (!missionId || !Array.isArray(selectedVolunteerIds) || selectedVolunteerIds.length === 0) {
            return res.status(400).json({ error: 'missionId and selectedVolunteerIds are required' });
        }


        const mission = await PetRescueMissionHistory.findOne({ missionId });
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
        }).select('fullname phonenumber email');
        const requester = await user.findById(userId).select('fullname email');

        for (const volunteer of volunteerUsers) {
            await sendMailNotification({
                email: volunteer.email,
                subject: 'Yêu Cầu Cứu Hộ Mới',
                text: `Bạn đã được chọn cho một nhiệm vụ cứu hộ mới`,
                html: `
                    <p>Xin chào ${volunteer.fullname},</p>
                    <p>Bạn đã được chọn cho một nhiệm vụ cứu hộ mới. Chi tiết nhiệm vụ:</p>
                    <ul>
                        <li>Mã nhiệm vụ: ${missionId}</li>
                        <li>Người yêu cầu: ${requester ? requester.fullname : 'Khách vãng lai'}</li>
                        <li>Vị trí: [${mission.location.coordinates.join(', ')}]</li>
                    </ul>
                    <p>Vui lòng xác nhận hoặc từ chối nhiệm vụ trong hệ thống.</p>
                `
            });
        }

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
        const { missionId } = req.body;
        const volunteerId = req.user._id;

        // Tìm mission và kiểm tra trạng thái
        const mission = await PetRescueMissionHistory.findOne({ missionId });
        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }

        if (!mission.selectedVolunteers.includes(volunteerId)) {
            return res.status(403).json({ error: 'You are not selected for this mission' });
        }

        if (mission.status !== 'pending') {
            return res.status(400).json({ error: `Mission is already ${mission.status}` });
        }

        // Kiểm tra xem mission có đang bị khóa không
        if (mission.isLocked) {
            // Nếu khóa đã hết hạn, giải phóng khóa
            if (mission.lockExpiresAt && mission.lockExpiresAt <= new Date()) {
                mission.isLocked = false;
                mission.lockExpiresAt = null;
            } else {
                // Nếu khóa vẫn còn hiệu lực, trả về lỗi
                return res.status(409).json({
                    error: 'Mission is currently being processed by another volunteer',
                    retryAfter: mission.lockExpiresAt
                });
            }
        }

        // Khóa mission để xử lý
        mission.isLocked = true;
        mission.lockExpiresAt = new Date(Date.now() + 30 * 1000); // Khóa trong 30 giây
        await mission.save();

        try {
            // Kiểm tra lại một lần nữa để đảm bảo mission vẫn ở trạng thái pending
            const updatedMission = await PetRescueMissionHistory.findOne({
                missionId,
                status: 'pending'
            });

            if (!updatedMission) {
                return res.status(409).json({ error: 'Mission status has changed' });
            }

            // Cập nhật mission
            updatedMission.acceptedVolunteer = volunteerId;
            updatedMission.status = 'in_progress';
            updatedMission.isLocked = false; // Giải phóng khóa
            updatedMission.lockExpiresAt = null;
            await updatedMission.save();

            // Gửi email thông báo cho người yêu cầu và volunteer
            const [requester, volunteer] = await Promise.all([
                updatedMission.requester ? user.findById(updatedMission.requester).select('fullname email') : null,
                user.findById(volunteerId).select('fullname email')
            ]);

            // Gửi email và thông báo cho người yêu cầu
            if (requester) {
                // Tạo thông báo trong app
                await Notification.create({
                    userId: requester._id.toString(),
                    type: 'success',
                    title: 'Đã có người nhận yêu cầu cứu hộ ✅',
                    message: `Tình nguyện viên ${volunteer.fullname} đã nhận yêu cầu cứu hộ của bạn và sẽ sớm đến hỗ trợ.`,
                    priority: 'high',
                    relatedTo: 'rescue_mission',
                    relatedId: missionId,
                    metadata: {
                        missionId,
                        acceptedAt: new Date(),
                        volunteerId: volunteerId.toString(),
                        volunteerName: volunteer.fullname,
                        location: mission.location
                    },
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });

                await sendMailNotification({
                    email: requester.email,
                    subject: 'Tình Nguyện Viên Đã Chấp Nhận Nhiệm Vụ',
                    text: `Tình nguyện viên đã chấp nhận yêu cầu cứu hộ của bạn`,
                    html: `
                        <p>Xin chào ${requester.fullname},</p>
                        <p>Tình nguyện viên ${volunteer.fullname} đã chấp nhận yêu cầu cứu hộ của bạn.</p>
                        <p>Mã nhiệm vụ: ${missionId}</p>
                        <p>Bạn sẽ nhận được thông báo khi nhiệm vụ hoàn thành.</p>
                    `
                });
            }
            await Notification.create({
                userId: volunteerId.toString(),
                type: 'info',
                title: 'Xác nhận nhận nhiệm vụ cứu hộ 🚀',
                message: 'Bạn đã nhận một nhiệm vụ cứu hộ mới. Hãy nhanh chóng đến địa điểm để hỗ trợ.',
                priority: 'high',
                relatedTo: 'rescue_mission',
                relatedId: missionId,
                metadata: {
                    missionId,
                    acceptedAt: new Date(),
                    location: mission.location
                },
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
            await sendMailNotification({
                email: volunteer.email,
                subject: 'Xác Nhận Chấp Nhận Nhiệm Vụ',
                text: `Xác nhận bạn đã chấp nhận nhiệm vụ cứu hộ`,
                html: `
                    <p>Xin chào ${volunteer.fullname},</p>
                    <p>Bạn đã chấp nhận nhiệm vụ cứu hộ (Mã: ${missionId}).</p>
                    <p>Vui lòng cập nhật trạng thái khi hoàn thành nhiệm vụ.</p>
                `
            });

            return res.json({
                message: 'Mission accepted successfully',
                missionId,
                status: updatedMission.status
            });
        } catch (error) {
            // Nếu có lỗi, giải phóng khóa
            mission.isLocked = false;
            mission.lockExpiresAt = null;
            await mission.save();
            throw error;
        }
    } catch (err) {
        console.error('Accept Mission Error:', err);
        return res.status(500).json({ error: 'Server error during mission acceptance' });
    }
};



export const rejectRescueMission = async (req, res) => {
    try {
        const { missionId } = req.params;
        const volunteerId = req.user._id;

        const mission = await PetRescueMissionHistory.findOne({ missionId })
            .populate('requester')
            .populate({
                path: 'selectedVolunteers',
                select: 'fullname email'
            });

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

        // Gửi email thông báo cho người yêu cầu
        if (mission.requester) {
            const volunteer = await user.findById(volunteerId).select('fullname email');
            await sendMailNotification({
                email: mission.requester.email,
                subject: 'Tình Nguyện Viên Đã Từ Chối Nhiệm Vụ',
                text: `Một tình nguyện viên đã từ chối nhiệm vụ cứu hộ của bạn`,
                html: `
                    <p>Xin chào ${mission.requester.fullname},</p>
                    <p>Tình nguyện viên ${volunteer.fullname} đã từ chối nhiệm vụ cứu hộ của bạn.</p>
                    <p>Mã nhiệm vụ: ${missionId}</p>
                    <p>Hệ thống sẽ tiếp tục tìm kiếm tình nguyện viên khác cho bạn.</p>
                `
            });
        }

        return res.json({ message: 'You have rejected the rescue mission.' });

    } catch (err) {
        console.error('Reject Rescue Mission Error:', err);
        return res.status(500).json({ error: 'Server error while rejecting mission' });
    }
};


export const cancelRescueMission = async (req, res) => {
    try {
        const { missionId } = req.params;
        const volunteerId = req.user._id;

        const mission = await PetRescueMissionHistory.findOne({ missionId }).populate('requester');

        if (!mission) {
            return res.status(404).json({ error: 'Nhiệm vụ không tồn tại' });
        }

        if (mission.status === 'completed' || mission.status === 'cancelled') {
            return res.status(400).json({ error: 'Không thể hủy nhiệm vụ đã kết thúc hoặc đã bị hủy' });
        }

        if (!mission.selectedVolunteers.includes(volunteerId)) {
            return res.status(403).json({ error: 'Bạn không thuộc nhiệm vụ này' });
        }

        mission.selectedVolunteers = mission.selectedVolunteers.filter(
            v => v.toString() !== volunteerId.toString()
        );

        if (mission.selectedVolunteers.length === 0) {
            mission.status = 'cancelled';
        }

        await mission.save();

        if (mission.requester) {
            await Notification.create({
                userId: mission.requester._id,
                type: 'warning',
                title: 'Tình nguyện viên đã từ chối',
                message: `Một tình nguyện viên đã từ chối nhiệm vụ cứu hộ.`,
            });
        }

        return res.json({
            message: 'Bạn đã từ chối nhiệm vụ cứu hộ thành công.',
            missionStatus: mission.status
        });

    } catch (err) {
        console.error('Lỗi khi từ chối nhiệm vụ cứu hộ:', err);
        return res.status(500).json({ error: 'Lỗi server khi hủy nhiệm vụ' });
    }
};

export const cancelRescueRequest = async (req, res) => {
    try {
        const { missionId } = req.body;
        const userId = req.user?._id;

        const mission = await PetRescueMissionHistory.findOne({ missionId })
            .populate('requester')
            .populate('acceptedVolunteer');

        if (!mission) {
            return res.status(404).json({ error: 'Nhiệm vụ không tồn tại' });
        }

        if (mission.requester && mission.requester._id.toString() !== userId?.toString()) {
            return res.status(403).json({ error: 'Bạn không có quyền hủy yêu cầu cứu hộ này' });
        }

        if (mission.status !== 'pending') {
            return res.status(400).json({ error: 'Không thể hủy nhiệm vụ đã bắt đầu hoặc đã kết thúc' });
        }

        mission.status = 'cancelled';
        mission.endedAt = new Date();
        await mission.save();

        // Nếu có volunteer đã nhận nhiệm vụ, gửi email thông báo
        if (mission.acceptedVolunteer) {
            await sendMailNotification({
                email: mission.acceptedVolunteer.email,
                subject: 'Yêu Cầu Cứu Hộ Đã Bị Hủy',
                text: `Người yêu cầu đã hủy nhiệm vụ cứu hộ`,
                html: `
                    <p>Xin chào ${mission.acceptedVolunteer.fullname},</p>
                    <p>Người yêu cầu đã hủy nhiệm vụ cứu hộ (Mã: ${missionId}).</p>
                    <p>Bạn không cần tiếp tục thực hiện nhiệm vụ này nữa.</p>
                    <p>Cảm ơn bạn đã sẵn sàng hỗ trợ.</p>
                `
            });
        }

        // Gửi email cho tất cả các volunteer được chọn
        if (mission.selectedVolunteers && mission.selectedVolunteers.length > 0) {
            const volunteers = await user.find({
                _id: { $in: mission.selectedVolunteers }
            }).select('fullname email');

            for (const volunteer of volunteers) {
                if (mission.acceptedVolunteer &&
                    volunteer._id.toString() === mission.acceptedVolunteer._id.toString()) {
                    continue; // Bỏ qua volunteer đã nhận nhiệm vụ vì đã gửi email ở trên
                }

                await sendMailNotification({
                    email: volunteer.email,
                    subject: 'Yêu Cầu Cứu Hộ Đã Bị Hủy',
                    text: `Người yêu cầu đã hủy nhiệm vụ cứu hộ`,
                    html: `
                        <p>Xin chào ${volunteer.fullname},</p>
                        <p>Người yêu cầu đã hủy nhiệm vụ cứu hộ (Mã: ${missionId}).</p>
                        <p>Bạn không cần phải xem xét nhiệm vụ này nữa.</p>
                    `
                });
            }
        }

        return res.json({
            message: 'Đã hủy yêu cầu cứu hộ thành công',
            missionStatus: mission.status
        });

    } catch (err) {
        console.error('Lỗi khi hủy yêu cầu cứu hộ:', err);
        return res.status(500).json({ error: 'Lỗi server khi hủy yêu cầu cứu hộ' });
    }
};


export const completeRescueMission = async (req, res) => {
    try {
        const { missionId } = req.params;
        const volunteerId = req.user._id;

        const mission = await PetRescueMissionHistory.findOne({ missionId })
            .populate('requester')
            .populate('acceptedVolunteer');

        if (!mission) {
            return res.status(404).json({ error: 'Nhiệm vụ không tồn tại' });
        }
        if (!mission.acceptedVolunteer || mission.acceptedVolunteer._id.toString() !== volunteerId.toString()) {
            return res.status(403).json({ error: 'Bạn không phải là tình nguyện viên được chấp nhận cho nhiệm vụ này' });
        }

        if (mission.status !== 'in_progress') {
            return res.status(400).json({ error: 'Chỉ có thể hoàn thành nhiệm vụ đang trong tiến trình' });
        }

        mission.status = 'completed';
        mission.endedAt = new Date();
        await mission.save();

        if (mission.requester) {
            const volunteer = await user.findById(volunteerId).select('fullname');
            await Notification.create({
                userId: mission.requester._id.toString(),
                type: 'success',
                title: 'Nhiệm vụ cứu hộ đã hoàn thành ✅',
                message: `Tình nguyện viên ${volunteer.fullname} đã hoàn thành nhiệm vụ cứu hộ của bạn.`,
                priority: 'high',
                relatedTo: 'rescue_mission',
                relatedId: missionId,
                metadata: {
                    missionId,
                    completedAt: new Date(),
                    volunteerId: volunteerId.toString(),
                    volunteerName: volunteer.fullname,
                    location: mission.location
                },
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Hết hạn sau 7 ngày
            });

            // Thông báo cho volunteer
            await Notification.create({
                userId: volunteerId.toString(),
                type: 'success',
                title: 'Hoàn thành nhiệm vụ cứu hộ 🎉',
                message: 'Cảm ơn bạn đã hoàn thành nhiệm vụ cứu hộ. Hãy tiếp tục giúp đỡ cộng đồng!',
                priority: 'medium',
                relatedTo: 'rescue_mission',
                relatedId: missionId,
                metadata: {
                    missionId,
                    completedAt: new Date(),
                    location: mission.location
                },
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        }

        return res.json({
            message: 'Đã hoàn thành nhiệm vụ cứu hộ thành công',
            missionStatus: mission.status
        });

    } catch (err) {
        console.error('Lỗi khi hoàn thành nhiệm vụ cứu hộ:', err);
        return res.status(500).json({ error: 'Lỗi server khi hoàn thành nhiệm vụ cứu hộ' });
    }
};