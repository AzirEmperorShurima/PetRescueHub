import { StatusCodes } from "http-status-codes";
import { getEventsByDateRange, getUpcomingEvents, getEventById } from "../services/Event/Event.service.js";
import mongoose from "mongoose";
import { getEventsByApprovalStatusService } from "../services/Admin/EventManagement.service.js";

/**
 * Lấy danh sách event theo khoảng thời gian (cho calendar view)
 */
export const getEventCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const options = {
      limit: parseInt(req.query.limit) || 100,
      page: parseInt(req.query.page) || 1,
      tags: req.query.tags ? req.query.tags.split(',') : [],
      location: req.query.location || null
    };

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Vui lòng cung cấp startDate và endDate"
      });
    }

    const result = await getEventsByDateRange(startDate, endDate, options);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result.events,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        totalEvents: result.totalEvents
      }
    });
  } catch (error) {
    console.error("Error in getEventCalendar:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lỗi server khi lấy danh sách event",
      error: error.message
    });
  }
};

/**
 * Lấy danh sách event sắp tới
 */
export const getUpcomingEventsList = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      days: parseInt(req.query.days) || 30
    };

    const result = await getUpcomingEvents(options);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result.events,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        totalEvents: result.totalEvents
      }
    });
  } catch (error) {
    console.error("Error in getUpcomingEventsList:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Lỗi server khi lấy danh sách event sắp tới",
      error: error.message
    });
  }
};

/**
 * Lấy chi tiết event
 */
export const getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Event ID không hợp lệ"
      });
    }

    const event = await getEventById(eventId);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error("Error in getEventDetails:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Lỗi server khi lấy chi tiết event"
    });
  }
};

// export const getEventsByApprovalStatus = async (req, res) => {
//   try {
//     const { approvalStatus } = req.body;
//     const { limit, page } = req.query;

//     const result = await getEventsByApprovalStatusService({ status: approvalStatus, limit, page });

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       data: result
//     })
//   }
//   catch (error) {
//     console.error("Error in getEventsByApprovalStatusService:", error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message || "Lỗi server khi lấy danh sách event"
//     });
//   }
// }

export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "ID sự kiện không hợp lệ" });
    }

    const event = await EventPost.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Không tìm thấy sự kiện" });
    }

    // Kiểm tra xem user đã tham gia chưa
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: "Bạn đã tham gia sự kiện này rồi" });
    }

    // Kiểm tra trạng thái sự kiện
    if (event.approvalStatus !== "approved" || event.postStatus !== "public") {
      return res.status(403).json({ message: "Sự kiện chưa được phê duyệt hoặc không công khai" });
    }

    // Thêm user vào danh sách participants
    event.participants.push(userId);
    await event.save();

    return res.status(200).json({ message: "Tham gia sự kiện thành công", event });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi tham gia sự kiện", error: error.message });
  }
};

// API: Thống kê số người tham gia
export const getParticipantCount = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "ID sự kiện không hợp lệ" });
    }

    const event = await EventPost.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Không tìm thấy sự kiện" });
    }

    const participantCount = event.participants.length;

    return res.status(200).json({ eventId, participantCount });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi lấy số người tham gia", error: error.message });
  }
};
