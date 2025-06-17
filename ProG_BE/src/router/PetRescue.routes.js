import { Router } from "express";
import {
    acceptRescueMission,
    cancelRescueMission,
    cancelRescueRequest,
    completeRescueMission,
    confirmSelectedVolunteers,
    rejectRescueMission,
    requestRescue,
    requestToRescue,
    searchUserRescueMissions
} from "../Controller/RescueHub.Controller.js";
import { isVolunteer } from "../Middlewares/check_is_volunteer.js";
import { checkUserAuth, checkUserRole } from "../Middlewares/userAuthChecker.js";
import { avatarUploadMiddleware } from "../Middlewares/CloudinaryUploader.Middlware.js";

const PetRescueRouter = Router();

// Áp dụng middleware xác thực cho toàn bộ router
PetRescueRouter.use(checkUserAuth);

// Route chào mừng
PetRescueRouter.get("/", (req, res) => {
    res.status(200).json({
        message: 'Chào mừng đến với API Cứu hộ thú cưng',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// ====== Nhóm routes tạo yêu cầu cứu hộ ====== //
PetRescueRouter.post('/rescue/requests/v1/create', checkUserRole, requestRescue);
PetRescueRouter.post('/rescue/requests/v2/create', [checkUserRole, avatarUploadMiddleware('pet_rescue')], requestToRescue);

PetRescueRouter.get('/rescue/rescue-missions/me', searchUserRescueMissions);
// GET /api/rescue-missions/me?status=pending,in_progress&keyword=cat&page=1&limit=5
// ====== Nhóm routes cho Chủ sở hữu ====== //
PetRescueRouter.post('/rescue/owner/confirm-volunteer', checkUserRole, confirmSelectedVolunteers);
PetRescueRouter.post('/rescue/owner/cancel-request', checkUserRole, cancelRescueRequest);

// ====== Nhóm routes cho Tình nguyện viên ====== //
PetRescueRouter.post('/rescue/volunteer/accept', isVolunteer, acceptRescueMission);
PetRescueRouter.post('/rescue/volunteer/reject/:missionId', isVolunteer, rejectRescueMission);
PetRescueRouter.post('/rescue/volunteer/cancel/:missionId', isVolunteer, cancelRescueMission);
PetRescueRouter.post('/rescue/volunteer/complete/:missionId', isVolunteer, completeRescueMission);

export default PetRescueRouter;
