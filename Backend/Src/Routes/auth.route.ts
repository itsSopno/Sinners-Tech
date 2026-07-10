import { Router } from "express";
import { registerUserController, LoginUserController, logoutUserController, getMeController, optionalController } from "../Controllers/auth.controller.js";
const authRouter: Router = Router();
authRouter.post("/register", registerUserController)
authRouter.post("/login", LoginUserController)
authRouter.get("/logout", logoutUserController)
authRouter.get("/getMe", getMeController)
authRouter.put("/optional", optionalController)
export default authRouter;