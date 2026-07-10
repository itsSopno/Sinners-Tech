import { Router } from "express";
import { createTopProductController, getAllTopProductController, getSingleTopProductController } from "../Controllers/top.controller.js";
import { isAdmin } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";

const TopRouter: Router = Router();

TopRouter.post("/", authUser, isAdmin, createTopProductController);
TopRouter.get("/", getAllTopProductController);
TopRouter.get("/:id", getSingleTopProductController);

export default TopRouter;