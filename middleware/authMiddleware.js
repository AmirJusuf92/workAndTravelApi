module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (!req.session.user) return res.redirect("/login");
      next();
    },
    isAdmin: (req, res, next) => {
      if (!req.session.user || req.session.user.role !== "admin") return res.redirect("/");
      next();
    }
  };