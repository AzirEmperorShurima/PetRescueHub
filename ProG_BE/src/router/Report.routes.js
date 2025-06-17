import { Router } from "express";
import { 
    createReport, 
    getUserReports,
    cancelReport 
} from "../Controller/Report.controller.js";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";
import { verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware } from "../utils/auth/authUtils.js";

const reportRouter = Router();

// Middleware xác thực người dùng
reportRouter.use(verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware, checkUserAuth);

// Routes
reportRouter.post("/create", createReport);
reportRouter.get("/user-reports", getUserReports);
reportRouter.delete("/cancel/:reportId", cancelReport);

export default reportRouter;