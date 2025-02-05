const express = require("express");
const multer = require("multer");
const path = require("path");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const db = require("../config/db");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, req.session.user.first_name + "_" + req.session.user.last_name + ".pdf");
  }
});

const upload = multer({ storage });

// File Upload
router.post("/upload", ensureAuthenticated, upload.single("pdf"), (req, res) => {
  db.query("INSERT INTO files (user_id, filename) VALUES (?, ?)", [req.session.user.id, req.file.filename], () => {
    res.redirect("/usr_dash");
  });
});

// File View & Download
router.get("/download/:filename", (req, res) => {
  res.download(path.join(__dirname, "../uploads", req.params.filename));
});

module.exports = router;
