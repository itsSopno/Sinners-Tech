import { Router } from "express";
import { getUserNotifications, markNotificationsRead } from "../Controllers/notification.controller.js";

const notificationRouter: Router = Router();

notificationRouter.get("/get/:email", getUserNotifications);
notificationRouter.patch("/read", markNotificationsRead);

export default notificationRouter;
