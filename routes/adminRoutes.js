const express = require("express");
const { isAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db");
const router = express.Router();
const ejsLayouts = require("express-ejs-layouts");
const engine = require('ejs-mate');
const app = express();


// Admin Dashboard
router.get("/admin_dash", isAdmin, (req, res) => {
  db.query(`
    SELECT files.*, users.first_name, users.last_name 
    FROM files 
    JOIN users ON files.user_id = users.id 
    ORDER BY users.first_name, users.last_name`, 
    (err, files) => {
      db.query("SELECT * FROM users WHERE role = 'user'", (err, users) => {
        res.render("admin_dash", { admin: req.session.user, users, files });
      });
  });
});

module.exports = router;
