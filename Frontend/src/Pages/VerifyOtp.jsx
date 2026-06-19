import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const userEmail = JSON.parse(localStorage.getItem("saveEmail"));

  const email = userEmail?.email;

  const { serverUrl } = useContext(ApiContext);

  // handle change
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/otpVerify/${email}`,
        {
          otp: finalOtp,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        navigate("/reset-password");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-5xl font-bold leading-tight">
            Verify Your <span className="text-yellow-400">OTP</span>
          </h1>

          <p className="mt-5 text-gray-300 text-lg">
            Enter the 6 digit OTP sent to your email address to securely verify
            your account and continue using E-Shop.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Secure OTP Verification</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Fast Account Recovery</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Protected User Access</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* HEADING */}
            <h1 className="text-3xl font-bold text-center text-gray-900">
              Verify OTP
            </h1>

            {/* TEXT */}
            <p className="text-center text-gray-500 mt-3 leading-7">
              Enter the 6 digit OTP sent to your email address.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-8">
              {/* OTP INPUTS */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="h-14 w-14 border border-gray-300 rounded-lg text-center text-2xl font-semibold outline-none focus:border-black"
                  />
                ))}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full mt-8 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
              >
                Verify OTP
              </button>

              {/* BACK */}
              <p className="text-center text-sm text-gray-600 mt-5">
                Didn’t receive OTP?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/forget-password")}
                  className="text-black font-medium hover:underline"
                >
                  Try Again
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
