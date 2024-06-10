function authMiddleware(req, res, next) {
    if (req.cookies.email) {
      next();
    } else {
      res.redirect("/");
    }
  }
  
  module.exports = authMiddleware;
  
  