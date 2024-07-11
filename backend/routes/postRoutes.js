import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";
import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";

const router = express.Router();

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPosts);
router
  .route("/:slug")
  .put(
    authGuard,
    adminGuard,
    uploadPicture.single("postPicture"),
    updatePost
  )
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;
