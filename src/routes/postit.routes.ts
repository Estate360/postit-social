import { Router } from "express";
import postController from "../controllers/postit.controller";
import { protect } from "../middlewares/authorize";

const router: Router = Router();

// create post
router.post("/posts", protect, postController.createPost);
// fetch posts
router.get("/posts", protect, postController.getAll);
// delete a post
router.delete("/deletePost/:id", protect, postController.deletePost);
// upvote post
router.patch("/posts/:userId/upvote/:id", protect, postController.upvote);
// get one post
router.get("/posts/:id", protect, postController.getOnePost);

export default router;
