import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
    _getVolunteers,
    acceptApproveVolunteer,
    addNewPackage,
    aggregateUserChartData,
    deactivateUser,
    deleteUser,
    getEventsByApprovalStatus,
    getUsers,
    getUserStatistics,
    getUserStats,
    getVolunteers,
    getVolunteerStatistics,
    rejectVolunteerRequest,
    revokeVolunteerRole,
    getAllReports,
    updateReport,
    getReportStats,
    getReportDetail,
    approveEvent,
    rejectEvent
} from "../Controller/Admin.controller.js";

import { checkAdminLogin, isAdmin } from "../Middlewares/Check_is_Admin.js";
import { validatePasswordStrength } from "../Middlewares/validatePasswordStrength.js";
import { loginHandler } from "../Controller/Auth.Controller.js";
import { verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware } from "../utils/auth/authUtils.js";

const adminRouter = Router();

// adminRouter.use(verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware)


adminRouter.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: "Chào mừng đến với trang quản trị",
        timestamp: new Date().toISOString()
    });
});

// Routes cho API v1
adminRouter.get("/v1", (req, res) => {
    res.status(200).json({
        message: 'Chào mừng đến với Admin API Version 1.0',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Routes cho API v2
adminRouter.get("/v2", (req, res) => {
    res.status(200).json({
        message: 'Chào mừng đến với Admin API Version 2.0',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

adminRouter.post(
    '/auth/login',
    [validatePasswordStrength, checkAdminLogin],
    loginHandler
);
adminRouter.use(isAdmin);

// Quản lý người dùng
adminRouter.route('/users')
    .get(getUsers)
    .delete(deleteUser);

// API v1 - Quản lý tình nguyện viên
adminRouter.get('/v1/volunteers', getVolunteers);

// API v2 - Quản lý tình nguyện viên
adminRouter.get('/v2/volunteers', _getVolunteers);

// Quản lý yêu cầu tình nguyện viên (v1)
adminRouter.post('/v1/volunteers/requests/accept', acceptApproveVolunteer);
adminRouter.post('/v1/volunteers/requests/reject', rejectVolunteerRequest);
adminRouter.put('/v1/volunteers/requests/revoke', revokeVolunteerRole);

adminRouter.get('/managent/events/event-list', getEventsByApprovalStatus)
adminRouter.post('/managent/events/action/approved', approveEvent)
adminRouter.post('/managent/events/action/rejected', rejectEvent)

adminRouter.get('/aggregate/users', aggregateUserChartData)
adminRouter.get('/aggregate/users/user', getUserStatistics)
adminRouter.get('/aggregate/users/volunteers', getVolunteerStatistics)
// Quản lý gói dịch vụ
adminRouter.post('/packages/create', addNewPackage);

// Thống kê người dùng
adminRouter.get('/stats/users', getUserStats);

// Quản lý trạng thái người dùng
adminRouter.patch('/users/:userId/deactivate', deactivateUser);


// Quản lý báo cáo
adminRouter.get('/reports', getAllReports);
adminRouter.get('/reports/stats', getReportStats);
adminRouter.get('/reports/details/:id', getReportDetail);
adminRouter.put('/reports/:id', updateReport);


export default adminRouter;