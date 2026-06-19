import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { serverUrl } = useContext(ApiContext);

  useEffect(() => {
    const verifiedSuccess = async () => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/v1/auth/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          setStatus("Verified Successfully ✅");

          toast.success(res.data.message);

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        setStatus("Verification Failed ❌");

        toast.error(error?.response?.data?.message || "Something went wrong");

        console.log(error);
      }
    };

    verifiedSuccess();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">E-Shop</span>
          </h1>

          <p className="mt-5 text-gray-300 text-lg">
            Your email verification keeps your account secure and helps you
            access all shopping features.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Secure Account Access</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Fast & Safe Shopping</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Exclusive Member Benefits</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md text-center">
            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">
                ✅
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-gray-900">
              Email Verification
            </h1>

            {/* STATUS */}
            <p className="mt-4 text-lg font-medium text-gray-700">{status}</p>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-500 leading-7">
              Your account has been verified successfully. You can now login and
              continue shopping on E-Shop.
            </p>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/login")}
              className="mt-8 w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
