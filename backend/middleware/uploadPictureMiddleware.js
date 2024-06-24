import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.floor(Math.random() * 1000000000)}${path.extname(
        file.originalname
      )}`
    );
  },
});

export const uploadPicture = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    console.log(ext);

    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp"
    ) {
      return cb(new Error("Only images are allowed..."));
    }
    return cb(null, true);
  },
});
