import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectToDatabase } from './mongoConfig.js';
import { apiLimiter } from './src/Middlewares/ExpressRateLimit.js';
import { scheduleCleanupJob } from './src/Jobs/Delete_not_Activate_Account_BullMQ.js';
import apiRouter from './src/router/api.routes.js';

const app = express();

connectToDatabase();
scheduleCleanupJob();

// App settings
app.set("env", "development");
app.set("port", process.env.PORT || 4000);
app.set('json spaces', 4);
// app.set('case sensitive routing', true);
// app.set('strict routing', true);

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(apiLimiter);


app.use('/api', apiRouter);

app.use('/api/*', (req, res) => {
    res.status(404).json({
        status: 'error',
        path: req.path,
        error: 'Endpoint not found',
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
