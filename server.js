const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const engine = require('ejs-mate');
const PORT = 6005;

app.set("view engine", "ejs");
app.set("views", "./views");





app.use(cookieParser());
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.render("home"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/adminRoutes"));
app.use("/", require("./routes/fileRoutes"));
app.use("/", require("./routes/messageRoutes"));
// renderi
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/admin_dash", (req, res) => res.render("admin_dash"));
app.get("/usr_dash", (req, res) => res.render("usr_dash"));
app.get("/message", (req, res) => res.render("message"));
app.get("/change_password", (req, res) => res.render("change_password"));
app.get("/admin_messages", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") return res.redirect("/");

    const query = `
        SELECT messages.message, messages.sent_at, 
               users.email AS user_email, 
               CASE WHEN messages.admin_id IS NOT NULL THEN 1 ELSE 0 END AS is_from_admin
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.sent_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send("Error fetching messages.");
        res.render("admin_messages", { admin: req.session.user, messages: results });
    });
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
