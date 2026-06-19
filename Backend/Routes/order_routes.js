import express from "express";
import {
  createOrder,
  getSalesData,
  getUserOrder,
  getUserOrders,
  verifyOrder,
} from "../Controllers/order_controller.js";
import { isAdmin, isAuth } from "../Middleware/isAuth.js";

const routes = express.Router();

routes.post("/create-order", isAuth, createOrder);
routes.post("/verify-order", isAuth, verifyOrder);
routes.get("/get-order", isAuth, getUserOrder);
routes.get("/get-user-orders", isAdmin, isAuth, getUserOrders);
routes.get("/get-user-all-orders/:userId", isAuth, isAdmin, getUserOrder);
routes.get("/sales", isAuth, isAdmin, getSalesData);

export default routes;
