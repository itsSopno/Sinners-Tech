import { Router } from "express";
import { createKeycapsCollectionController, getAllKeyCapsCollectionController, getSingleKeycapController, updateKeycapController, deleteKeycapController } from "../Controllers/keycap.controller.js";
import { isAdmin } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";
const keycapsRouter: Router = Router();

keycapsRouter.post("/", authUser, isAdmin, createKeycapsCollectionController)
keycapsRouter.get("/", getAllKeyCapsCollectionController)
keycapsRouter.get("/:id", getSingleKeycapController)
keycapsRouter.put("/:id", authUser, isAdmin, updateKeycapController)
keycapsRouter.delete("/:id", authUser, isAdmin, deleteKeycapController)

export default keycapsRouter