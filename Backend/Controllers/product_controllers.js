import { Product } from "../Model/product_Schema.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

/* Api for post/set/add product */
export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    // check product details fields
    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(401).json({
        success: false,
        message: " All fields required",
      });
    }

    // now set product img
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "Product_mern", // folder name for cloudinary
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // create new product
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });

    return res.status(201).json({
      success: true,
      message: "Product add Successfully✅",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* Api for get all products */
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* Api for delete product */
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete product from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete product from mongoDB
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product Delete Successfully✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* Api for update product */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;
    const userId = req.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not Found",
      });
    }

    let updatedImg = [];

    // keep selected old image
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImg = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // delete only remove img
      const removeImg = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (let img of removeImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImg = product.productImg;
    }

    // Upload new images
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "Product_mern", // folder name for cloudinary
        });
        updatedImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    //update product data

    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImg;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully✅",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server error",
    });
  }
};
