import { Router } from "express";
import { createPost, getAllPosts, deletePostController, getPostByUserEmail, toggleLike, addComment } from "../Controllers/post.controller.js";


const Postrouter = Router();

Postrouter.post("/create", createPost);
Postrouter.get("/get", getAllPosts);
Postrouter.delete("/delete/:id", deletePostController);
Postrouter.get("/get/:email", getPostByUserEmail);

// New Routes
Postrouter.patch("/:id/like", toggleLike);
Postrouter.post("/:id/comment", addComment);

export default Postrouter;