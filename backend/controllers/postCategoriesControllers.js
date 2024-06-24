import Post from "../models/Post.js";
import PostCategories from "../models/PostCategories.js";

export const createPostCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    const postCategory = await PostCategories.findOne({ title });
    if (postCategory) {
      const error = new Error("Category is already created");
      return next(error);
    }

    const newPostCategory = new PostCategories({ title });
    const savedPostCategory = await newPostCategory.save();
    return res.status(201).json(savedPostCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllPostCategory = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyWord;
    let where = {};
    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await PostCategories.find(where).countDocuments();
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
    const result = await PostCategories.find(where)
      .skip(skip)
      .limit(pageSize)
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePostCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    const postCategory = await PostCategories.findByIdAndUpdate(
      req.params.postCategoryId,
      { title },
      { new: true }
    );

    if (!postCategory) {
      const error = new Error("Couldn't find post category");
      return next(error);
    }
    return res.status(200).json(postCategory);
  } catch (error) {
    next(error);
  }
};

export const deletePostCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.postCategoryId;

    await Post.updateMany(
      { categories: { $in: [categoryId] } },
      { $pull: { categories: categoryId } }
    );

    await PostCategories.deleteOne({ _id: categoryId });

    res.send("Post category is deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const getSingleCategory = async (req, res, next) => {
  try {
    const postCategory = await PostCategories.findById(
      req.params.postCategoryId
    );

    if (!postCategory) {
      const error = new Error("Category was not found");
      return next(error);
    }

    return res.status(201).json(postCategory);
  } catch (error) {
    next(error);
  }
};
