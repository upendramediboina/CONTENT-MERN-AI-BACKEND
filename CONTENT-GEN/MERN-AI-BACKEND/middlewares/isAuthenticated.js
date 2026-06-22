const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//----IsAuthenticated middleware
const isAuthenticated = asyncHandler(async (req, res, next) => {
  console.log("Cookies:", req.cookies);

  if (req.cookies && req.cookies.token) {
    const decoded = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET
    );

    req.user = await User.findById(decoded.id).select("-password");

    return next();
  }

  return res.status(401).json({
    message: "Not authorized, no token",
  });
});

module.exports = isAuthenticated;