import { Router } from "express";
import { getConversation, getRecentChats, sendMessageREST } from "../Controllers/message.controller.js";

const router = Router();

// /api/messages/history/:userId1/:userId2
router.get("/history/:userId1/:userId2", getConversation);

// /api/messages/recent/:userId
router.get("/recent/:userId", getRecentChats);

// /api/messages/send (REST fallback)
router.post("/send", sendMessageREST);

export default router;
