import { Router } from "express";
import { getEventCalendar, getUpcomingEventsList, getEventDetails } from "../Controller/Event.Controller.js";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";

const eventRouter = Router();

// Middleware xác thực người dùng
eventRouter.use(checkUserAuth);

// Route lấy danh sách event theo khoảng thời gian (cho calendar view)
eventRouter.get("/calendar", getEventCalendar);

// Route lấy danh sách event sắp tới
eventRouter.get("/upcoming", getUpcomingEventsList);

// Route lấy chi tiết event
eventRouter.get("/:eventId", getEventDetails);

export default eventRouter;