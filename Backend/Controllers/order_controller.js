import crypto from "crypto";
import { razorpayInstance } from "../config/razorpay.js";
import { User } from "../Model/auth_Schema.js";
import { Cart } from "../Model/cart_Schema.js";
import { Order } from "../Model/order_schema.js";
import { Product } from "../Model/product_Schema.js";

/* CREATE ORDER */
export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    const newOrder = await Order.create({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.log("Error during create order", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* VERIFY ORDER */

export const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;

    /* IF FAILED PAYMENT */
    if (paymentFailed) {
      const failedOrder = await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          status: "failed",
        },
        { new: true },
      );

      return res.status(400).json({
        success: false,
        message: "Payment Failed",
        order: failedOrder,
      });
    }

    /* TO VERIFY SIGNATURE */

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(sign.toString())
      .digest("hex");

    /* VALID */
    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true },
      );

      /* TO CLEAR CART  IF VERIFy*/

      await Cart.findOneAndUpdate(
        {
          userId: req.user._id,
        },
        {
          $set: {
            items: [],
            totalPrice: 0,
          },
        },
      );

      return res.status(200).json({
        success: true,
        message: "Order Successful ✅",
        order,
      });
    } else {
      /* INVALID SIGNATURE */
      const failedOrder = await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          status: "failed",
        },
        { new: true },
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
        order: failedOrder,
      });
    }
  } catch (error) {
    console.log("Error during verify order", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* GET ORDERS */
export const getUserOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
    })
      .populate("products.productId", "productName productImg productPrice")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error to get order",
    });
  }
};

// Access admin only
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      user: userId,
    })
      .populate("products.productId", "productName productImg productPrice")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error to get order",
    });
  }
};

export const getAllUserOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      user: userId,
    })
      .populate("products.productId", "productName productImg productPrice")
      .populate("user", "firstName lastName email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error to get order",
    });
  }
};


/* API FOR GET SALES DATA */
export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({
      status: "paid",
    });
    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });
    const failedOrders = await Order.countDocuments({
      status: "failed",
    });

    const salesData = await Order.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,

          totalSales: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    const recentOrders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    return res.status(200).json({
      success: true,
      totalSales,
      totalUsers,
      totalProducts,
      totalOrders,
      paidOrders,
      pendingOrders,
      failedOrders,
      recentOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
