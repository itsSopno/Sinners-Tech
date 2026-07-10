import { Router } from "express";
import { createKeyboardCollectionControler, getAllKeyboards, getSingleKeyboard } from "../Controllers/keyboard.controller.js";
import { isAdmin } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";

const keyboardRouter: Router = Router();
keyboardRouter.post("/", authUser, isAdmin, createKeyboardCollectionControler)
keyboardRouter.get("/", getAllKeyboards)
keyboardRouter.get("/:id", getSingleKeyboard)

export default keyboardRouter