import { Router } from "express";

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

export default PetRescueRouter;