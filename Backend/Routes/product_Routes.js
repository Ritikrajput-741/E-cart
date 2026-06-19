import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../Controllers/product_controllers.js";
import { isAdmin, isAuth } from "../Middleware/isAuth.js";
import { multipleUpload } from "../Middleware/multer.js";

const routes = express.Router();

routes.post("/addproduct", isAuth, isAdmin, multipleUpload, addProduct);
routes.get("/getallproducts", getAllProduct);
routes.delete("/deleteproduct/:productId", deleteProduct);
routes.put("/updatedproduct/:productId", isAuth, isAdmin, multipleUpload, updateProduct);

export default routes;
