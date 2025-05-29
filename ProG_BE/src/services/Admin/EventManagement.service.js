// adminApproveEvent.js
import { EventPost } from "../../models/PostSchema.js";

export const approveEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const adminId = req.user._id

        const event = await EventPost.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });
 
        event.approvalStatus = "approved";
        event.approvedBy = adminId;
        event.postStatus = "public";

        await event.save();

        res.json({ message: "Event approved successfully", event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const rejectEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const adminId = req.user._id;

        const event = await EventPost.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        event.approvalStatus = "rejected";
        event.approvedBy = adminId;
        event.postStatus = "hidden";

        await event.save();

        res.json({ message: "Event rejected successfully", event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getEventsByApprovalStatus = async (req, res) => {
    try {
        const { status } = req.query;

        // Validate status
        const validStatuses = ["pending", "approved", "rejected"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status filter." });
        }

        const filter = status ? { approvalStatus: status } : {};

        const events = await EventPost.find(filter)
            .sort({ createdAt: -1 })
            .populate("author", "username email") 
            .populate("approvedBy", "username email");

        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Lấy danh sách sự kiện theo trạng thái duyệt và phân trang.
 * 
 * @param {Object} options - Tùy chọn lọc và phân trang.
 * @param {string} [options.status] - Trạng thái duyệt (pending, approved, rejected).
 * @param {number} [options.page=1] - Trang hiện tại.
 * @param {number} [options.limit=10] - Số lượng sự kiện mỗi trang.
 * @returns {Promise<Object>} Trả về đối tượng chứa danh sách sự kiện, tổng số trang và tổng số sự kiện.
 */
export async function getEventsByApprovalStatusService({ status, page = 1, limit = 10 }) {
    const validStatuses = ["pending", "approved", "rejected"];
    if (status && !validStatuses.includes(status)) {
        throw new Error("Invalid status filter.");
    }

    const filter = status ? { approvalStatus: status } : {};
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
        EventPost.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "username email")
            .populate("approvedBy", "username email"),
        EventPost.countDocuments(filter)
    ]);

    return {
        page,
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        events
    };
}