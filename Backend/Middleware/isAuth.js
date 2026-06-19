import jwt from "jsonwebtoken";
import { User } from "../Model/auth_Schema.js";

/* isAuth middleware check */
export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: `Token is missing or Invalid`,
      });
    }

    const token = await authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: `Token is Expired, try new One`,
        });
      }

      return res.status(401).json({
        success: false,
        message: `Token verification failed`,
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }

    req.userId = user._id;
    req.user = user;
    req.id = user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server error ${error} ${error.message}`,
    });
  }
};

/* isAdmin check */

export const isAdmin = async (req, res, next) => {
  const user = req.user;
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "Unauthorized access❌",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
