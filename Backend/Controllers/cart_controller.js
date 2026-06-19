import { Cart } from "../Model/cart_Schema.js";
import { Product } from "../Model/product_Schema.js";

/* Api for get cart */
export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Empty",
        cart: [],
      });
    }
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* Api for add to cart */
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // cart not found than create new one
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
      });
    } else {
      // check is product already exist
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        // if product exist - just increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // if no exist - than push new
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }

    await cart.save();

    const populateCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Item Added to cart✅",
      cart: populateCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    // check quantity more than 1
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be less than 1",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // check product exist in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // quantity update
    cart.items[itemIndex].quantity = quantity;

    // totalPrice recalculate
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully✅",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* Api for removed from cart */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // product cart mein hai?
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // item remove karo
    cart.items.splice(itemIndex, 1);

    // totalPrice recalculate karo
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart✅",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
