import { Router } from "express";
import { 
    getAllProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject 
} from "../Controllers/ProjectDetails.controller.js";

const projectRouter = Router();

projectRouter.get("/all", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post("/create", createProject);
projectRouter.put("/update/:id", updateProject);
projectRouter.delete("/delete/:id", deleteProject);

export default projectRouter;
