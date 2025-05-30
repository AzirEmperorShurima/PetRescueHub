import { Router } from 'express';
import express from 'express';
import authRouter from './Auth.routes.js';
import forumRoutes from './Forum.routes.js';
import userRoute from './User.routes.js';
import petRoute from './Pet.routes.js';
import adminRouter from './Admin.routes.js';
import volunteerRouter from './Volunteer.routes.js';
import PetRescueRouter from './PetRescue.routes.js';
import privateRoute from '../Controller/private/Private.routes.js';
import eventRouter from './Event.routes.js';
import reportRouter from './Report.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiRouter = Router();

// API sub-routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/forum', forumRoutes);
apiRouter.use('/user', userRoute);
apiRouter.use('/volunteer', volunteerRouter);
apiRouter.use('/pet', petRoute);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/PetRescue', PetRescueRouter);
apiRouter.use('/report', reportRouter);

// Static routes
apiRouter.use('/root', express.static(path.join(__dirname, '../root/image')));
apiRouter.use('/private/test', privateRoute);


// API root route
apiRouter.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API for User service',
    });
});

apiRouter.use('/events', eventRouter);

export default apiRouter;