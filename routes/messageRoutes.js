const express = require("express");
const { ensureAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db");
const router = express.Router();

// User Sending Message to Admin
router.post("/message_admin", ensureAuthenticated, (req, res) => {
  db.query("INSERT INTO messages (user_id, message) VALUES (?, ?)", [req.session.user.id, req.body.message], () => {
    res.redirect("/usr_dash");
  });
});
//admin onli


// Admin Reading Messages
router.get("/admin_messages", isAdmin, (req, res) => {
  db.query("SELECT messages.message, messages.sent_at, users.email AS user_email FROM messages JOIN users ON messages.user_id = users.id ORDER BY messages.sent_at DESC", (err, messages) => {
    res.render("admin_messages", { messages });
  });})

router.post("/message", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") return res.status(403).send("Forbidden");
  db.query("INSERT INTO messages (admin_id, user_id, message) VALUES (?, ?, ?)", [req.session.user.id, req.body.user_id, req.body.message], err => {
    res.redirect("/admin_dash");
  });
});

// user message

module.exports = router;
