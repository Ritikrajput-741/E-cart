import { ApiContext } from "@/context/ApiProvider";

import { setCart } from "@/Redux/Slice/productSlice";

import axios from "axios";

import { Minus, Plus, ShoppingCart, Star } from "lucide-react";

import { useContext, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();

  const cleanId = id.trim();

  const { serverUrl } = useContext(ApiContext);

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");

  const accessToken = user?.accessToken;

  const products = useSelector((store) => store.product.product);

  const product = products.find((item) => item._id === cleanId);

  const [mainImage, setMainImage] = useState(
    product?.productImg?.[0]?.url || product?.productImg?.[0]?.secure_url,
  );

  const [quantity, setQuantity] = useState(1);

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/cart/add`,
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
        toast.success("Product added to cart ✅");

        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 lg:p-10 grid lg:grid-cols-2 gap-12">
        {/* LEFT */}

        <div>
          <div className="bg-gray-100 rounded-3xl p-5 overflow-hidden group">
            <img
              src={mainImage}
              alt="product"
              className="h-[350px] sm:h-[450px] w-full object-contain transition-all duration-500 group-hover:scale-125 cursor-zoom-in"
            />
          </div>

          <div className="flex gap-4 mt-5 overflow-x-auto pb-2">
            {product?.productImg?.map((img, index) => (
              <img
                key={index}
                src={img?.url || img?.secure_url}
                alt="product"
                onClick={() => setMainImage(img?.url || img?.secure_url)}
                className={`h-24 w-24 object-contain border-2 rounded-2xl cursor-pointer p-2 bg-white transition-all duration-300 ${
                  mainImage === (img?.url || img?.secure_url)
                    ? "border-black"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star fill="currentColor" size={18} />

              <Star fill="currentColor" size={18} />

              <Star fill="currentColor" size={18} />

              <Star fill="currentColor" size={18} />

              <Star fill="currentColor" size={18} />
            </div>

            <span className="text-gray-500 text-sm">(120 Reviews)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            {product?.productName}
          </h1>

          <p className="text-gray-500 mt-6 leading-8 text-lg">
            {product?.productDesc}
          </p>

          <h2 className="text-4xl sm:text-5xl font-bold mt-8 text-black">
            ₹{product?.productPrice}
          </h2>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">Brand:</span>

              <span className="text-gray-600">{product?.brand}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">Category:</span>

              <span className="text-gray-600">{product?.category}</span>
            </div>
          </div>

          {/* BUTTON */}

          <button
            onClick={() => addToCart(product?._id)}
            className="mt-10 flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl hover:bg-gray-800 transition-all duration-300 text-lg font-semibold"
          >
            <ShoppingCart size={22} />
            Add To Cart
          </button>

          {/* FEATURES */}

          <div className="mt-10 space-y-4 text-gray-600">
            <p>✓ Free shipping on orders over ₹299</p>

            <p>✓ Secure payment system</p>

            <p>✓ 7 days easy return</p>

            <p>✓ 24/7 customer support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
