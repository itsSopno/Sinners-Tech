
import express, { type Application, type Request, type Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './Routes/auth.route.js'
import keyboardRouter from './Routes/keyboard.route.js'
import keycapsRouter from './Routes/keycaps.route.js';
import allproductRouter from './Routes/allproduct.route.js';
import paymentRouter from './Routes/payment.route.js';
import googleRouter from './Routes/google.route.js';
import TopRouter from './Routes/topRouter.js';
import geminiRouter from './Routes/gemini.route.js';
import userRouter from './Routes/totalUser.route.js';
import messageRouter from './Routes/message.route.js';
import PostRouter from './Routes/post.route.js';
import projectRouter from './Routes/project.route.js';
// Configure dotenv
dotenv.config();

const app: Application = express();

app.use(cors({
    origin: (_origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'cache-control', 'remember-me'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

import notificationRouter from './Routes/notification.route.js';
import friendRouter from './Routes/friend.route.js';

/**
 * @route using all routes
 */
app.use("/api", authRouter)
app.use("/api/google", googleRouter)
app.use("/api/keyboard", keyboardRouter)
app.use("/api/keycaps", keycapsRouter)
app.use("/api/all-products", allproductRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/top-products", TopRouter)
app.use("/api/ai", geminiRouter)
app.use("/api/user", userRouter)
app.use("/api/messages", messageRouter)
app.use("/api/post", PostRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/friend", friendRouter)
app.use("/api/project", projectRouter)

/**
 * @route test router
 */
app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Server is running" })
})

export default app;