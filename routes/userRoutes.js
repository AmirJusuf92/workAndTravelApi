const express = require("express");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const router = express.Router();

// User Dashboard
router.get("/usr_dash", ensureAuthenticated, (req, res) => {
  db.query("SELECT * FROM files WHERE user_id = ?", [req.session.user.id], (err, files) => {
    db.query("SELECT messages.message, messages.sent_at, users.email AS user_email FROM messages JOIN users ON messages.user_id = users.id ORDER BY messages.sent_at DESC", [req.session.user.id], (err, messages) => {
      res.render("usr_dash", { user: req.session.user, files, messages });
    });
  });
});

// Change Password
router.post("/change_password", ensureAuthenticated, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  db.query("SELECT password FROM users WHERE id = ?", [req.session.user.id], async (err, results) => {
    if (!await bcrypt.compare(oldPassword, results[0].password)) return res.send("Incorrect old password");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, req.session.user.id], () => {
      res.redirect("/usr_dash");
    });
  });
});

module.exports = router;
