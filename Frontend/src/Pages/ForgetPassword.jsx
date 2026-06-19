import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [userEmailValue, setUserEmailValue] = useState({
    email: "",
  });

  const { serverUrl } = useContext(ApiContext);

  const navigate = useNavigate();

  // save email
  const saveEmail = () => {
    localStorage.setItem("saveEmail", JSON.stringify(userEmailValue));
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserEmailValue({
      ...userEmailValue,
      [name]: value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/forgetPassword`,
        userEmailValue,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        saveEmail();

        toast.success(res.data.message);

        navigate("/verify-otp");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-5xl font-bold leading-tight">
            Reset Your <span className="text-yellow-400">Password</span>
          </h1>

          <p className="mt-5 text-gray-300 text-lg">
            Enter your email address and receive an OTP to securely reset your
            password and access your E-Shop account again.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Secure Password Recovery</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Quick OTP Verification</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Safe Account Protection</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* HEADING */}
            <h1 className="text-3xl font-bold text-center text-gray-900">
              Forgot Password
            </h1>

            {/* TEXT */}
            <p className="text-center text-gray-500 mt-3 leading-7">
              Enter your email address and we’ll send you an OTP to reset your
              password.
            </p>

            {/* FORM */}
            <form className="mt-8" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-700 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
              >
                Send OTP
              </button>

              {/* BACK */}
              <p className="text-center text-sm text-gray-600 mt-5">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-black font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
