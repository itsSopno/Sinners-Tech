import { Router } from "express";
import { CreateAllProductController, getAllProduct, getSingleProductController, changeProductController } from "../Controllers/allProduct.controller.js";
import { isAdmin } from "../middleware/post.middleware.js";
import { authUser } from "../middleware/auth.middleware.js";

const allproductRouter: Router = Router();

allproductRouter.post("/create", authUser, isAdmin, CreateAllProductController)
allproductRouter.get("/getall", getAllProduct)
allproductRouter.get("/getSingle/:id", getSingleProductController)
allproductRouter.put("/update/:id", authUser, isAdmin, changeProductController)

export default allproductRouter;
