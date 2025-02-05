const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, first_name, last_name, password, dob } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.query("INSERT INTO users (email, first_name, last_name, password, dob, role) VALUES (?, ?, ?, ?, ?, ?)", 
    [email, first_name, last_name, hashedPassword, dob, "user"], (err) => {
      if (err) return res.send("Error: " + err);
      res.redirect("/login");
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.render("login", { message: "User not found" });

    const user = results[0];
    if (!await bcrypt.compare(password, user.password)) return res.render("login", { message: "Incorrect password" });

    req.session.user = { id: user.id, first_name: user.first_name, last_name: user.last_name, role: user.role };
    return user.role === "admin" ? res.redirect("/admin_dash") : res.redirect("/usr_dash");
  });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
