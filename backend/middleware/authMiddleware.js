import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select("-password");
      next();
    } catch (error) {
      next(error);
    }
  } else {
    const err = new Error("Not authorized, no token...");
    err.statusCode = 401;
    next(err);
  }
};

export const adminGuard = async (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let error = new Error("Not authorized as an admin");
    error.statusCode = 401;
    next(error);
  }
};
