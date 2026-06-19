import axios from "axios";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/Redux/Slice/productSlice";
import { ApiContext } from "@/context/ApiProvider";
import { Trash2 } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serverUrl } = useContext(ApiContext);
  const cart = useSelector((store) => store.product.cart);
  const addresses = useSelector((store) => store.product.addresses);
  const selectedAddress = useSelector(
    (store) => store.product.selectedAddresses,
  );

  const userData = JSON.parse(localStorage.getItem("userAllData") || "{}");
  const accessToken = userData?.accessToken;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    email: "",
    address: "",
    country: "",
    city: "",
    pincode: "",
  });

  /* INPUT */

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* SAVE ADDRESS */

  const saveAddressHandler = () => {
    const { fullName, phoneNo, email, address, country, city, pincode } =
      formData;
    if (
      !fullName ||
      !phoneNo ||
      !email ||
      !address ||
      !country ||
      !city ||
      !pincode
    ) {
      return toast.error("All fields required");
    }
    dispatch(addAddress(formData));
    toast.success("Address Saved ✅");
    setFormData({
      fullName: "",
      phoneNo: "",
      email: "",
      address: "",
      country: "",
      city: "",
      pincode: "",
    });
  };

  /* DELETE ADDRESS */

  const deleteHandler = (index) => {
    dispatch(deleteAddress(index));
    toast.success("Address Removed ✅");
  };

  /* ORDER SUMMARY */

  const subtotal = useMemo(() => {
    return (
      cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ||
      0
    );
  }, [cart]);
  const tax = Math.floor(subtotal * 0.18);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + tax + shipping;

  /* PAYMENT */

  const paymentHandler = async () => {
    try {
      if (selectedAddress === null) {
        return toast.error("Please select delivery address");
      }
      setLoading(true);

      /* CREATE ORDER */

      const orderRes = await axios.post(
        `${serverUrl}/api/v1/order/create-order`,
        {
          products: cart.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          amount: total,
          tax,
          shipping,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const order = orderRes.data.order;

      /* RAZORPAY */
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "E-CART",
        description: "Payment For Order",
        order_id: order.id,
        theme: {
          color: "#000000",
        },

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${serverUrl}/api/v1/order/verify-order`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (verifyRes.data.success) {
              toast.success("Payment Success ✅");
              dispatch(
                setCart({
                  items: [],
                  totalPrice: 0,
                }),
              );

              navigate("/order-success");
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment Verification Failed");
          }
        },

        modal: {
          ondismiss: async function () {
            await axios.post(
              `${serverUrl}/api/v1/order/verify-order`,
              {
                razorpay_order_id: order.id,
                paymentFailed: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );
            toast.error("Payment Cancelled");
          },
        },

        prefill: {
          name: addresses[selectedAddress]?.fullName,
          email: addresses[selectedAddress]?.email,
          contact: addresses[selectedAddress]?.phoneNo,
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Payment Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT */}

        <div className="lg:col-span-2 space-y-8">
          {/* ADDRESS FORM */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h1 className="text-3xl font-bold mb-8">Delivery Address</h1>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={inputHandler}
                placeholder="Full Name"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />

              <input
                type="number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={inputHandler}
                placeholder="Phone Number"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={inputHandler}
                placeholder="Email Address"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black md:col-span-2"
              />

              <textarea
                rows={4}
                name="address"
                value={formData.address}
                onChange={inputHandler}
                placeholder="Full Address"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black md:col-span-2 resize-none"
              />

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={inputHandler}
                placeholder="Country"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={inputHandler}
                placeholder="City"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />

              <input
                type="number"
                name="pincode"
                value={formData.pincode}
                onChange={inputHandler}
                placeholder="Pincode"
                className="border rounded-2xl px-5 py-4 outline-none focus:border-black"
              />
            </div>

            <button
              onClick={saveAddressHandler}
              className="mt-8 bg-black hover:bg-yellow-400 hover:text-black text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold"
            >
              Save Address
            </button>
          </div>

          {/* SAVED ADDRESS */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h1 className="text-3xl font-bold mb-8">Saved Addresses</h1>

            <div className="space-y-5">
              {addresses?.length > 0 ? (
                addresses.map((item, index) => (
                  <div
                    key={index}
                    className={`border rounded-3xl p-5 transition-all duration-300 ${
                      selectedAddress === index
                        ? "border-black bg-yellow-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h1 className="text-xl font-bold">{item.fullName}</h1>

                        <p className="text-gray-600 mt-2">{item.address}</p>

                        <p className="text-gray-600">
                          {item.city}, {item.country} - {item.pincode}
                        </p>

                        <p className="text-gray-600 mt-2">{item.phoneNo}</p>

                        <p className="text-gray-600">{item.email}</p>

                        <button
                          onClick={() => dispatch(setSelectedAddress(index))}
                          className="mt-4 bg-black text-white px-5 py-2 rounded-xl hover:bg-yellow-400 hover:text-black transition-all duration-300"
                        >
                          Deliver Here
                        </button>
                      </div>

                      <button
                        onClick={() => deleteHandler(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No address saved
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div>
          <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-28">
            <h1 className="text-3xl font-bold mb-8">Order Summary</h1>

            {/* PRODUCTS */}

            <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2">
              {cart?.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item?.productId?.productImg?.[0]?.url}
                    alt="product"
                    className="h-20 w-20 rounded-2xl object-cover border"
                  />

                  <div className="flex-1">
                    <h1 className="font-semibold line-clamp-2">
                      {item?.productId?.productName}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                      Qty : {item.quantity}
                    </p>
                  </div>

                  <h2 className="font-bold">₹{item.price * item.quantity}</h2>
                </div>
              ))}
            </div>

            {/* PRICE */}

            <div className="border-t mt-8 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>

                <span className="font-semibold">₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax (18%)</span>

                <span className="font-semibold">₹{tax}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>

                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t pt-4 flex items-center justify-between text-xl font-bold">
                <span>Total</span>

                <span>₹{total}</span>
              </div>
            </div>

            {/* PAYMENT BUTTON */}

            <button
              onClick={paymentHandler}
              disabled={loading}
              className="w-full mt-8 bg-black hover:bg-yellow-400 hover:text-black text-white py-4 rounded-2xl transition-all duration-300 font-semibold text-lg disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue To Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
