import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./config/db.js";
import cors from "cors";
connectDB();

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";

import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";

/*********************  Essential Middlewares *********************/
app.use(
  cors({
    origin: "*",
    exposedHeaders: [
      "x-filter",
      "x-totalcount",
      "x-currentpage",
      "x-pagesize",
      "x-totalpagecount",
    ],
  })
);
app.use(express.json());

/*********************  Test Route *********************/
app.get("/", (_, res) => {
  res.send("Welcome to the home page...");
});

/*********************  To Access Static Assets *********************/
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/*********************  Custom Routes *********************/
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", postCategoriesRoutes);

/*********************  To Handel Errors *********************/
app.use(invalidPathHandler);
app.use(errorResponserHandler);

/*********************  Listening to PORT *********************/
const PORT = process.env.PORT || "5000";
app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
