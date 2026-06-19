import express from "express";
import {
  confirmPassword,
  forgetPassword,
  getAllUser,
  getUserById,
  loginUser,
  logOutUser,
  updateUser,
  userRegister,
  verifyOtp,
  verifyToken,
} from "../Controllers/auth_Controller.js";
import { isAdmin, isAuth } from "../Middleware/isAuth.js";
import { singleUpload } from "../Middleware/multer.js";
import { userSchema, validateUser } from "../Validator/validator.js";

const routes = express.Router();

routes.post("/register", validateUser(userSchema), userRegister);
routes.post("/verify", verifyToken);
routes.post("/login", loginUser);
routes.post("/logout", isAuth, logOutUser);
routes.post("/forgetPassword", forgetPassword);
routes.post("/otpVerify/:email", verifyOtp);
routes.post("/confirm-password/:email", confirmPassword);
routes.get("/allUsers", isAuth, isAdmin, getAllUser);
routes.get("/getUser/:userId", getUserById);
routes.put("/update/:id", isAuth, singleUpload, updateUser);

export default routes;
