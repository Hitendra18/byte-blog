import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "Sample Title",
      caption: "Sample Caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      photoPublicId: "",
      user: req.user._id,
    });
    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      next(error);
      return;
    }

    const handleUpdatePostData = async (data) => {
      const { title, caption, slug, body, tags, categories } = JSON.parse(
        data || "{}"
      );
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;
      const updatedPost = await post.save();
      return res.json(updatedPost);
    };

    if (req.file) {
      let filename = req.file.filename;
      let photoPublicId = post.photoPublicId;

      // if previously any photo exists then remove it
      if (photoPublicId) {
        const res = await deleteFromCloudinary(photoPublicId);
        if (res == null) {
          const err = new Error("error removing post photo...");
          return next(err);
        }
      }

      // after removing previous photo upload new one
      const uploadRes = await uploadOnCloudinary(
        path.join(__dirname, "..", "uploads", filename)
      );
      fileRemover(filename);

      // if not uploaded then throw an error
      if (uploadRes == null) {
        const err = new Error("error uploading post photo...");
        return next(err);
      }

      post.photo = uploadRes.url;
      post.photoPublicId = uploadRes.publicId;
      handleUpdatePostData(req.body.document);
    } else {
      let photoPublicId = post.photoPublicId;
      post.photo = "";
      post.photoPublicId = "";

      // remove image from from cloudinary
      await deleteFromCloudinary(photoPublicId);
      handleUpdatePostData(req.body.document);
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    await deleteFromCloudinary(post.photoPublicId);

    await Comment.deleteMany({ post: post._id });
    return res.json({ message: "Post is successfully deleted" });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "categories",
        select: ["title"],
      },
      {
        path: "comments",
        match: { check: true, parent: null },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: { check: true },
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);
    if (!post) {
      const error = new Error("Post was not found");
      next(error);
      return;
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyWord;
    let where = {};

    if (filter) {
      where.$or = [
        { title: { $regex: filter, $options: "i" } },
        { caption: { $regex: filter, $options: "i" } },
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Post.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.set({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }
    const result = await Post.find(where)
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
        {
          path: "categories",
          select: ["title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
