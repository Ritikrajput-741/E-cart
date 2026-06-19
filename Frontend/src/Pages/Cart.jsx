import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ApiContext } from "@/context/ApiProvider";
import { setCart } from "@/Redux/Slice/productSlice";

import axios from "axios";

import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);

  const navigate = useNavigate();

  const { serverUrl } = useContext(ApiContext);

  const dispatch = useDispatch();

  const shippingCharge =
    cart?.totalPrice > 299 ? 0 : (cart?.totalPrice || 0) * 0.05;

  const totalAmount = (cart?.totalPrice || 0) + shippingCharge;

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");

  const accessToken = user?.accessToken;

  /* GET CART ITEMS */
  const loadCart = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCart;
  }, [dispatch]);

  /* UPDATE QUANTITY */
  const handleQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) return;

      const res = await axios.put(
        `${serverUrl}/api/v1/cart/update`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* REMOVE ITEMS FROM CART */
  const handleRemoveItems = async (productId) => {
    try {
      const res = await axios.delete(`${serverUrl}/api/v1/cart/remove`, {
        data: { productId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(res.data.message || "Item removed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {cart?.items?.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-5">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border p-5 flex flex-col sm:flex-row gap-5"
                >
                  {/* IMAGE */}
                  <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                    <img
                      src={
                        item?.productId?.productImg?.[0]?.url ||
                        item?.productId?.productImg?.[0]?.secure_url
                      }
                      alt="product"
                      className="h-32 w-32 object-contain"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <h1 className="text-lg font-semibold line-clamp-2">
                      {item?.productId?.productName}
                    </h1>

                    <h2 className="text-2xl font-bold mt-3">
                      ₹{item?.productId?.productPrice}
                    </h2>

                    <div className="flex items-center gap-4 mt-5">
                      {/* QUANTITY */}
                      <div className="flex items-center border rounded-xl overflow-hidden">
                        {/* DECREASE */}
                        <button
                          onClick={() =>
                            handleQuantity(
                              item?.productId?._id,
                              item.quantity - 1,
                            )
                          }
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-5 font-semibold">
                          {item.quantity}
                        </span>

                        {/* INCREASE */}
                        <button
                          onClick={() =>
                            handleQuantity(
                              item?.productId?._id,
                              item.quantity + 1,
                            )
                          }
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => handleRemoveItems(item?.productId?._id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div>
              <div className="bg-white rounded-2xl border p-6 sticky top-5">
                <h1 className="text-2xl font-bold">Order Summary</h1>

                <div className="space-y-5 mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Total Items</span>

                    <span className="font-semibold">{cart.items.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Subtotal</span>

                    <span className="font-semibold">₹{cart.totalPrice}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Shipping</span>

                    <span className="font-semibold">₹{shippingCharge}</span>
                  </div>

                  <div className="border-t pt-5 flex items-center justify-between">
                    <span className="text-lg font-bold">Total</span>

                    <span className="text-2xl font-bold">₹{totalAmount}</span>
                  </div>
                </div>

                {/* PROMO */}
                <div className="mt-8 border-t pt-6">
                  <h2 className="font-semibold mb-3">Promo Code</h2>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 border rounded-xl px-4 py-3 outline-none"
                    />

                    <button className="bg-black text-white px-5 rounded-xl hover:bg-gray-800">
                      Apply
                    </button>
                  </div>
                </div>

                {/* BUTTONS */}
                <button onClick={()=> navigate('/address')} className="w-full mt-8 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-300">
                  Place Order
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full mt-4 border border-black py-3 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  Continue Shopping
                </button>

                {/* DESCRIPTION */}
                <div className="mt-8 space-y-3 text-sm text-gray-500">
                  <p>✓ Secure payment system</p>
                  <p>✓ Fast delivery available</p>
                  <p>✓ Easy return policy</p>
                  <p>✓ 24/7 customer support</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[70vh] flex flex-col items-center justify-center bg-white rounded-2xl border">
            <h1 className="text-4xl font-bold">Your Cart is Empty</h1>

            <p className="text-gray-500 mt-4">
              Looks like you haven’t added anything yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-8 bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
