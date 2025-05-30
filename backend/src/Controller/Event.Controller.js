import { StatusCodes } from "http-status-codes";
import { getEventsByDateRange, getUpcomingEvents, getEventById } from "../services/Event/Event.service.js";
import mongoose from "mongoose";

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