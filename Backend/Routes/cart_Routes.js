import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../Controllers/cart_controller.js";
import { isAuth } from "../Middleware/isAuth.js";

const routes = express.Router();

routes.get("/get", isAuth, getCart);
routes.post("/add", isAuth, addToCart);
routes.put("/update", isAuth, updateQuantity);
routes.delete("/remove", isAuth, removeFromCart);

export default routes;
