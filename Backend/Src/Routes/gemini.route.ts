import { Router } from "express";
import { geminiTestController } from "../Controllers/geminitest.controller.js";
import { aiLimiter } from "../middleware/ai.limter.js";

const geminiRouter: Router = Router();

geminiRouter.post("/recommend", aiLimiter, geminiTestController);

export default geminiRouter;
