import { Router } from "express";

const volunteerRouter = Router();

volunteerRouter.get("/", async (req, res) => {
    console.log('Received request at /api/volunteer');
    res.status(200).json({
        message: 'Welcome to Volunteer API',
        ip: req.ip,
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

volunteerRouter.post("/test", async (req, res) => {

});