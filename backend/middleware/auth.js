const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user data in request object
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
