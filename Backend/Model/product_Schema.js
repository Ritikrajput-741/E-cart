import mongoose from "mongoose";

export const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    productName: { type: String, required: true },
    productDesc: { type: String, required: true },

    productImg: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    productPrice: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Product = new mongoose.model("Product", productSchema);
