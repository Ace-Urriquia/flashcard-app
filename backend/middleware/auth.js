const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No valid token found in request");
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded token data:", decoded);

    if (!decoded.userId) {
      console.error("❌ Token does not contain userId:", decoded);
      return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
    }

    req.user = decoded;
    console.log("✅ Token verified. User ID:", req.user.userId);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
