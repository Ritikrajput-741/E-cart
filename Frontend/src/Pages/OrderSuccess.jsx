import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const {user} = useSelector(store => store.user)
//   useEffect(()=> {
// console.log(user);
// console.log("first");
//   },[])
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-lg p-10 text-center">
        {/* SUCCESS ICON */}

        <div className="flex justify-center">
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle2 size={90} className="text-green-500" />
          </div>
        </div>

        {/* TITLE */}

        <h1 className="text-4xl font-bold mt-8">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Thank you for shopping with us. Your payment has been received and
          your order is now being processed.
        </p>

        {/* ORDER STATUS CARD */}

        <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-green-700">
            Payment Successful ✅
          </h2>

          <p className="text-gray-600 mt-2">
            Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        {/* BUTTONS */}

        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button
            onClick={() => navigate("/products")}
            className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all duration-300 font-semibold"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </button>

          <button
            onClick={() => navigate(`/profile/${user._id}`)}
            className="flex-1 flex items-center justify-center gap-3 border-2 border-black py-4 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 font-semibold"
          >
            <Package size={20} />
            View Orders
          </button>
        </div>

        {/* FOOTER */}

        <p className="text-sm text-gray-400 mt-8">
          Need help? Contact our support team anytime.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
