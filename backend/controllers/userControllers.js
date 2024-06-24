import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import mongoose from "mongoose";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // check if user exists or not
    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User already registered...");
    }

    // creating a new user
    user = await User.create({ name, email, password });
    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User doesn't exist...");
    }

    if (!(await user.comparePassword(password))) {
      throw new Error("Incorrect Email or Password...");
    }

    return res.status(200).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const userProfile = async (req, res, next) => {
  try {
    // console.log(req.user);
    let user = await User.findById(req.user._id);
    if (user) {
      return res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      const err = new Error("User not found...");
      err.statusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.userId;

    let userId = req.user._id;

    // console.log("userId", userId);
    // console.log("userIdToUpdate", new mongoose.Types.ObjectId(userIdToUpdate));

    // if (userId.equals(new mongoose.Types.ObjectId(userIdToUpdate))) {
    //   console.log("They are equal");
    // } else {
    //   console.log("They are not equal");
    // }

    if (!userId.equals(new mongoose.Types.ObjectId(userIdToUpdate))) {
      let error = new Error("Forbidden Resource");
      error.statusCode = 403;
      throw error;
    }
    // if (!req.user.admin && userId !== userIdToUpdate) {
    //   let error = new Error("Forbidden Resource");
    //   error.statusCode = 403;
    //   throw error;
    // }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Couldn't find user...");
    }

    console.log("user", user);
    console.log("req.body", req);

    if (typeof req.body.admin !== "undefined" && req.user.admin) {
      user.admin = req.body.admin;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password should be at least 6 character long...");
    }
    user.password = req.body.password || user.password;

    await user.save();

    res.status(200).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");
    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occurred during uploading... " + err.message
        );
        next(error);
      } else {
        if (req.file) {
          let filename;
          const updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          if (filename) {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();

          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: updatedUser.generateJWT(),
          });
        } else {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyWord;
    let where = {};
    if (filter) {
      where.email = { $regex: filter, $options: "i" };
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }
    const result = await User.find(where)
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    let user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found...");
    }

    const postsToDelete = await Post.find({ user: user._id });
    const postIdsToDelete = postsToDelete.map((post) => post._id);
    await Comment.deleteMany({
      post: { $in: postIdsToDelete },
    });
    await Post.deleteMany({
      _id: { $in: postIdsToDelete },
    });

    postsToDelete.forEach((post) => {
      fileRemover(post.photo);
    });

    let avatar = user.avatar;
    if (avatar) {
      fileRemover(avatar);
    }
    await user.deleteOne();

    return res.status(204).json({ message: "User is deleted successfully" });
  } catch (error) {
    next(error);
  }
};
