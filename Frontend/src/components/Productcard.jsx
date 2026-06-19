import { setCart } from "@/Redux/Slice/productSlice";
import axios from "axios";
import { Loader, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductCard = ({ product, loading, serverUrl }) => {
  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");
  const accessToken = user?.accessToken;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  /* FETCH DATA FOR ADD TO CART */
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product added to cart✅");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error?.response);
    }
  };
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer">
      {/* IMAGE */}
      <div
        className="bg-gray-100 p-5 flex items-center justify-center "
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {loading ? (
          <Loader className="animate-spin " />
        ) : (
          <img
            src={
              product?.productImg?.[0]?.url ||
              product?.productImg?.[0]?.secure_url
            }
            alt="product"
            className="h-52 w-full object-contain"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h1 className="text-lg font-semibold line-clamp-2">
          {product.productName}
        </h1>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.productDesc}
        </p>

        <div className="flex items-center justify-between mt-5">
          <h2 className="text-2xl font-bold">₹{product.productPrice}</h2>

          <button
            onClick={() => addToCart(product._id)}
            className="bg-black text-white p-3 rounded-xl hover:bg-gray-800"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
