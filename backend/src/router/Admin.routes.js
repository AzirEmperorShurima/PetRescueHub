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

const adminRouter = Router()

adminRouter.get("/", (req, res) => {
    console.log('Received request at /api/admin');
    res.status(StatusCodes.OK).json({ message: "Welcome to Admin page" })
})

adminRouter.get("/Get/list-users", [isAdmin], getUsers)
adminRouter.get("/Get/v1/list-volunteers", [isAdmin], getVolunteers)
adminRouter.get("/Get/v2/list-volunteers", [isAdmin], _getVolunteers)

adminRouter.post("/Volunteer/v1/accept", [isAdmin], acceptApproveVolunteer)
adminRouter.post("/Volunteer/v1/reject", [isAdmin], rejectVolunteerRequest)
adminRouter.post("/Volunteer/v1/revoke", [isAdmin], revokeVolunteerRole)

adminRouter.delete("/Delete/user", [isAdmin], deleteUser)

export default adminRouter