import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
} from "../controllers/userControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/register", (req, res) => {
//   res.json({ success: "response sent successfully" });
// });
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfile);
router.put("/updateProfile/:userId", authGuard, updateProfile);
router.put("/updateProfilePicture", authGuard, updateProfilePicture);
router.get("/", authGuard, adminGuard, getAllUsers);
router.delete("/:userId", authGuard, adminGuard, deleteUser);

export default router;
