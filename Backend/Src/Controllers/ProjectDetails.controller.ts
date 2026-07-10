import type { Request, Response } from "express";
import ProjectDetail from "../Models/PortfolioProject.model.js";

/**
 * @name getAllProjects
 * @desc Fetch all portfolio projects
 * @route GET /api/project/all
 */
export const getAllProjects = async (_req: Request, res: Response) => {
    try {
        const projects = await ProjectDetail.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        console.error("Error in getAllProjects:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name getProjectById
 * @desc Fetch a single project by ID
 * @route GET /api/project/:id
 */
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await ProjectDetail.findById(id);
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        return res.status(200).json({
            success: true,
            project
        });
    } catch (error) {
        console.error("Error in getProjectById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name createProject
 * @desc Create a new portfolio project
 * @route POST /api/project/create
 */
export const createProject = async (req: Request, res: Response) => {
    try {
        const {
            projectName,
            projectDescription,
            projectImage,
            projectLiveLink,
            projectGitHubLink,
            projectTags,
            projectStatus,
            projectType,
            projectDemoLink,
            projectThumbnail,
            Tech
        } = req.body;

        const newProject = await ProjectDetail.create({
            projectName,
            projectDescription,
            projectImage,
            projectLiveLink,
            projectGitHubLink,
            projectTags,
            projectStatus,
            projectType,
            projectDemoLink,
            projectThumbnail,
            Tech
        });

        return res.status(201).json({
            success: true,
            project: newProject
        });
    } catch (error) {
        console.error("Error in createProject:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name updateProject
 * @desc Update an existing project
 * @route PUT /api/project/update/:id
 */
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProject = await ProjectDetail.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        return res.status(200).json({
            success: true,
            project: updatedProject
        });
    } catch (error) {
        console.error("Error in updateProject:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name deleteProject
 * @desc Delete a project
 * @route DELETE /api/project/delete/:id
 */
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProject = await ProjectDetail.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteProject:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
