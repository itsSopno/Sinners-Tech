import { Router } from "express";
import { GoogleAuthController, getMe, LogoutController, optionalController } from "../Controllers/googleAuth.controller.js";
import { isLoggedIn } from "../middleware/isLogedIn.js";
const googleRouter: Router = Router();
googleRouter.post("/register", GoogleAuthController)
googleRouter.get("/register", isLoggedIn, getMe)
googleRouter.get("/logout", isLoggedIn, LogoutController)
googleRouter.put("/optional", isLoggedIn, optionalController)
export default googleRouter;