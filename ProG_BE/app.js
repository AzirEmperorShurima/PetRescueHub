import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './src/router/Auth.routes.js';
import { connectToDatabase } from './mongoConfig.js';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import forumRoutes from './src/router/Forum.routes.js';
// import 'ProG_BE/src/Jobs/Delete_not_Activate_Account_BullMQ.js'

const app = express();
connectToDatabase()
app.set("env", "development");
app.set("port", process.env.PORT || 4000)
app.set('trust proxy', true)
app.set('json spaces', 4);
app.set('case sensitive routing', true) // phân biệt Api và api
app.set('strict routing', true) // phân biệt /user và /user/

app.use(compression())
app.use(cookieParser())
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRouter);
app.use('/api/forum', forumRoutes)
app.use('/api/*', (req, res) => {
    res.status(404).json({
        status: 'error',
        error: 'Endpoint not found',
    });
});

// Định tuyến API gốc (chỉ cho /api)
app.get('/api', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API for User service',
    });
});

// Middleware xử lý lỗi tổng quát
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        error: 'Internal Server Error',
        err: err
    });
});

export default app;
