import { type Request, type Response } from "express";
import PostModel from "../Models/post.model.js";
import { type CustomRequest } from "../middleware/auth.middleware.js";

/**
 * @name CreatePost 
 * @desc by this controller , user can post anything
 * @route POST/api/post/create
 * @acess Public
 *  */
export const createPost = async (req: CustomRequest, res: Response) => {
    try {
        const { author, content, images } = req.body;

        // Enhanced Validation
        if (!content && (!images || images.length === 0)) {
            return res.status(400).json({ success: false, message: "POST_EMPTY: Broadcast requires content or media" });
        }

        if (!author || !author.email || !author.userID) {
            return res.status(400).json({ success: false, message: "AUTHOR_IDENTITY_MISSING: Authentication node broken" });
        }

        const newPost = await PostModel.create({
            author: {
                userID: author.userID,
                email: author.email,
                username: author.username || "Anonymous_Node",
                userImage: author.userImage || "",
            },
            userEmail: author.email,
            content: content || "",
            images: images || [],
            likes: [],
            comments: []
        });

        return res.status(201).json({
            success: true,
            message: "POST_PUBLISHED: System update complete",
            post: newPost
        });
    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name LikePost/UnlikePost 
 * @desc Toggle like for a post
 * @route PATCH/api/post/:id/like
 * @acess Private
 */
export const toggleLike = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { userID } = req.body; // or req.user.id if using auth middleware strictly

        if (!userID) {
            return res.status(400).json({ success: false, message: "USER_IDENTITY_REQUIRED: Pulse sync failed" });
        }

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "POST_NOT_FOUND: Node missing from stream" });
        }

        const likeIndex = post.likes.indexOf(userID);
        if (likeIndex === -1) {
            // Like
            post.likes.push(userID);
        } else {
            // Unlike
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: likeIndex === -1 ? "HEARTBEAT_SYNCED" : "HEARTBEAT_DISCONNECTED",
            likes: post.likes
        });
    } catch (error) {
        console.error("Error in toggleLike:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name AddComment 
 * @desc Push a comment into the post stream
 * @route POST/api/post/:id/comment
 * @acess Private
 */
export const addComment = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { userID, email, username, image, comment } = req.body;

        if (!comment || !userID || !email) {
            return res.status(400).json({ success: false, message: "MALFORMED_INPUT: Data packet incomplete" });
        }

        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "POST_NOT_FOUND: Destination unreachable" });
        }

        post.comments.push({
            userID,
            email,
            username: username || "Anonymous",
            image,
            comment,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await post.save();

        return res.status(200).json({
            success: true,
            message: "DATA_INJECTED: Comment added to stream",
            comment: post.comments[post.comments.length - 1]
        });
    } catch (error) {
        console.error("Error in addComment:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @name getAllPost 
 * @desc by using this controller , user can get every post 
 * @route GET/api/post
 * @acess Public 
 */
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPosts = await PostModel.countDocuments();

        return res.status(200).json({
            success: true,
            message: "DATA_SYNC_COMPLETE: Stream connected",
            count: posts.length,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            posts
        });

    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({
            success: false,
            message: "CONNECTION_FAILED: Error fetching posts from stream"
        });
    }
};

/**
 * @name getPostById
 * @desc by using this controller , user can get specific post 
 * @route GET/api/post/:id
 * @acess Public 
 */
export const getPostByUserEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const posts = await PostModel.find({ "author.email": email }).sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(200).json({
                success: true,
                message: "NO_POSTS_FOUND: Identity stream empty",
                posts: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "DATA_RETRIEVED: Synchronizing user stream...",
            count: posts.length,
            posts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL_ERROR: Connection failed",
        });
    }
};

/**
 * @name deletePost Controller
 * @desc user can delete his own post 
 * @route DELETE/api/post/:id
 * @acess Public
 */
export const deletePostController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedPost = await PostModel.findByIdAndDelete(id);

        if (!deletedPost) return res.status(404).json({ success: false, message: "Post not found" });

        return res.status(200).json({
            success: true,
            message: "POST_TERMINATED: Node removed from stream"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting post" });
    }
};