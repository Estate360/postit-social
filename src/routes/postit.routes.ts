import { Router } from "express";
import postController from "../controllers/postit.controller";
import { protect } from "../middlewares/authorize";

const router: Router = Router();

//Authorization middleware to check if user is logged in
router.use(protect);

//Create Post
router.post("/posts/:userId", postController.createPost);
//Fetch all Postit
router.get("/posts", postController.getAllPost);
//update post
router.patch("/posts/:id", postController.updatePost);
// delete a post
router.delete("/deletePost/:id", postController.deletePost);
// upvote post
router.patch("/posts/:userId/upvote/:postId", postController.upvote);
// get one post
router.get("/posts/:id", postController.getOnePost);

export default router;
