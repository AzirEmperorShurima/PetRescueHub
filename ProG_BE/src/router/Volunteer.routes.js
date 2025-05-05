import { Router } from "express";
import { requestVolunteer, volunteerUpdateStatus } from "../Controller/Volunteer.Controller.js";

const volunteerRouter = Router();


volunteerRouter.get("/", async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Volunteer API Service',
            version: '2.0',
            documentation: '/api/volunteer/docs',
            endpoints: {
                v1: '/api/volunteer/v1',
                v2: '/api/volunteer/v2'
            },
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});


volunteerRouter.get("/v1", async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            version: '1.0',
            service: 'Volunteer API',
            features: [
                'Basic volunteer registration',
                'Status updates',
                'Profile management'
            ],
            ip: req.ip,
            status: 'active',
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

volunteerRouter.get("/v2", async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            version: '2.0',
            service: 'Volunteer API',
            features: [
                'Advanced volunteer matching',
                'Real-time status updates',
                'Enhanced profile management',
                'Analytics integration'
            ],
            status: 'active',
            deprecationNotice: null,
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});
volunteerRouter.post("/v1/requesting/grow-up/volunteer", requestVolunteer)
volunteerRouter.post("/v1/updating/volunteer/status", volunteerUpdateStatus)

export default volunteerRouter;