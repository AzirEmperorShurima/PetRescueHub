import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
    _getVolunteers,
    acceptApproveVolunteer,
    deleteUser, getUsers,
    getVolunteers,
    rejectVolunteerRequest,
    revokeVolunteerRole
} from "../Controller/Admin.controller.js";
import { isAdmin } from "../Middlewares/Check_is_Admin.js";
import { validatePasswordStrength } from "../Middlewares/validatePasswordStrength.js";
import { loginHandler } from "../Controller/Auth.Controller.js";
const adminRouter = Router()

adminRouter.get("/", (req, res) => {
    console.log('Received request at /api/admin');
    res.status(StatusCodes.OK).json({ message: "Welcome to Admin page" })
})
adminRouter.get("/v1", async (req, res) => {
    console.log('Received request at /api/admin/v1');
    res.status(200).json({
        message: 'Welcome to Admin API Version 1.0',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

adminRouter.get("/v2", async (req, res) => {
    console.log('Received request at /api/admin/v2');
    res.status(200).json({
        message: 'Welcome to Admin API Version 2.0',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});
adminRouter.post('/private-access/admin/login', [validatePasswordStrength, isAdmin], loginHandler);

adminRouter.get("/Get/list-users", [isAdmin], getUsers)
adminRouter.get("/Get/v1/list-volunteers", [isAdmin], getVolunteers)
adminRouter.get("/Get/v2/list-volunteers", [isAdmin], _getVolunteers)

adminRouter.post("/Volunteer/v1/accept", [isAdmin], acceptApproveVolunteer)
adminRouter.post("/Volunteer/v1/reject", [isAdmin], rejectVolunteerRequest)
adminRouter.post("/Volunteer/v1/revoke", [isAdmin], revokeVolunteerRole)

adminRouter.delete("/Delete/user", [isAdmin], deleteUser)

export default adminRouter