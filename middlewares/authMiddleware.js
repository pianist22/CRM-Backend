// middleware/authMiddleware.js
exports.authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No authorization token found" });
      }
  
      const token = authHeader.split(" ")[1];
  
      // For now, you can just check if it's a valid user ID (or later decode a JWT)
      // Example: fake session check
      if (!token || token.length < 5) {
        return res.status(403).json({ message: "Invalid token" });
      }
  
      // You can optionally fetch the user from DB
      // const user = await User.findById(token);
      // if (!user) return res.status(404).json({ message: "User not found" });
  
      // Attach user info to request for use in controllers
      req.user = { id: token };
  
      next(); // proceed to controller
    } catch (error) {
      return res.status(500).json({ message: "Auth failed", error: error.message });
    }
  };
  