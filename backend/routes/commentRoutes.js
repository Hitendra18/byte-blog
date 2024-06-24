import express from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/commentControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authGuard, createComment)
  .get(authGuard, adminGuard, getAllComments);
router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);
// router.put("/:commentId", authGuard, updateComment);

export default router;
