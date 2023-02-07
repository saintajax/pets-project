const multer = require("multer");
const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const FILES_TMP = path.resolve("./tmp");
const FILES_TMP = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILES_TMP);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
