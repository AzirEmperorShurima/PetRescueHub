import { EventPost } from "../../models/PostSchema.js";
import mongoose from "mongoose";

/**
 * Lấy danh sách event theo khoảng thời gian (cho calendar view)
 * @param {Date} startDate - Ngày bắt đầu khoảng thời gian
 * @param {Date} endDate - Ngày kết thúc khoảng thời gian
 * @param {Object} options - Các tùy chọn bổ sung
 * @returns {Promise<Array>} Danh sách event
 */
export const getEventsByDateRange = async (startDate, endDate, options = {}) => {
  try {
    const { limit = 100, page = 1, tags = [], location = null } = options;
    const skip = (page - 1) * limit;

    // Xây dựng filter
    const filter = {
      postStatus: "public", // Chỉ lấy event đã được public
      approvalStatus: "approved", // Chỉ lấy event đã được duyệt
      $or: [
        // Event bắt đầu trong khoảng thời gian
        {
          eventStartDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        },
        // Event kết thúc trong khoảng thời gian
        {
          eventEndDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        },
        // Event bao trùm khoảng thời gian
        {
          eventStartDate: { $lte: new Date(startDate) },
          eventEndDate: { $gte: new Date(endDate) }
        }
      ]
    };

    // Thêm filter theo tags nếu có
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Thêm filter theo location nếu có
    if (location) {
      // Có thể mở rộng để tìm kiếm theo khoảng cách địa lý nếu cần
      filter.eventLocation = { $regex: location, $options: 'i' };
    }

    const [events, total] = await Promise.all([
      EventPost.find(filter)
        .sort({ eventStartDate: 1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username email avatar")
        .populate("approvedBy", "username email"),
      EventPost.countDocuments(filter)
    ]);

    return {
      events,
      page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    };
  } catch (error) {
    console.error("Error in getEventsByDateRange:", error);
    throw error;
  }
};

/**
 * Lấy danh sách event sắp tới
 * @param {Object} options - Các tùy chọn
 * @returns {Promise<Array>} Danh sách event
 */
export const getUpcomingEvents = async (options = {}) => {
  try {
    const { limit = 10, page = 1, days = 30 } = options;
    const skip = (page - 1) * limit;
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    const filter = {
      postStatus: "public",
      approvalStatus: "approved",
      eventStartDate: { $gte: now, $lte: futureDate }
    };

    const [events, total] = await Promise.all([
      EventPost.find(filter)
        .sort({ eventStartDate: 1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username email avatar")
        .populate("approvedBy", "username email"),
      EventPost.countDocuments(filter)
    ]);

    return {
      events,
      page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    };
  } catch (error) {
    console.error("Error in getUpcomingEvents:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết event
 * @param {String} eventId - ID của event
 * @returns {Promise<Object>} Chi tiết event
 */
export const getEventById = async (eventId) => {
  try {
    const event = await EventPost.findOne({
      _id: new mongoose.Types.ObjectId(eventId),
      postStatus: "public",
      approvalStatus: "approved"
    })
      .populate("author", "username email avatar")
      .populate("approvedBy", "username email");

    if (!event) {
      throw new Error("Event không tồn tại hoặc chưa được duyệt");
    }

    return event;
  } catch (error) {
    console.error("Error in getEventById:", error);
    throw error;
  }
};