import { Router } from "express";
import {
    acceptRescueMission,
    cancelRescueMission,
    cancelRescueRequest,
    completeRescueMission,
    confirmSelectedVolunteers,
    rejectRescueMission,
    requestRescue,
    requestToRescue
} from "../Controller/RescueHub.Controller.js";
import { isVolunteer } from "../Middlewares/check_is_volunteer.js";
import { checkUserAuth, checkUserRole } from "../Middlewares/userAuthChecker.js";

const PetRescueRouter = Router();

PetRescueRouter.get("/", async (req, res) => {
    console.log('Received request at /api/PetRescueHub');
    res.status(200).json({
        message: 'Welcome to PetRescueHub API',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

PetRescueRouter.post("/v1/rescue/create-rescue-request", [checkUserAuth, checkUserRole], requestRescue)
PetRescueRouter.post("/v2/rescue/create-rescue-request", [checkUserAuth, checkUserRole], requestToRescue)

PetRescueRouter.post("/v1/rescue/host/owner/confirm-volunteer", [checkUserAuth, checkUserRole], confirmSelectedVolunteers)
PetRescueRouter.post("/v1/rescue/host/owner/rescue-request/cancel", [checkUserAuth, checkUserRole], cancelRescueRequest);

PetRescueRouter.post("/v1/rescue/host/volunteer/rescue-request/accept", [isVolunteer], acceptRescueMission)
PetRescueRouter.post("/v1/rescue/host/volunteer/rescue-request/reject", [isVolunteer], rejectRescueMission)
PetRescueRouter.post("/v1/rescue/host/volunteer/rescue-request/cancel-pending-request", [isVolunteer], cancelRescueMission)

PetRescueRouter.post("/v1/rescue/host/volunteer/complete-rescue/:missionId", [isVolunteer], completeRescueMission);


export default PetRescueRouter;