import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiContext } from "@/context/ApiProvider";
import { setUser } from "@/Redux/Slice/userSlice";
import axios from "axios";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const { serverUrl } = useContext(ApiContext);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/api/v1/auth/login`, userData, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        localStorage.setItem("userAllData", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome Back to <span className="text-yellow-400">E-Shop</span>
          </h1>

          <p className="mt-5 text-gray-300 text-lg">
            Login to continue shopping your favorite products with secure access
            and fast checkout.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Easy Shopping Experience</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Secure Payments</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <p>Fast Delivery</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <Card className="w-full border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Login Account
              </CardTitle>

              <CardDescription className="text-center">
                Login to continue your journey
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <Label>Email</Label>

                    <Input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Enter email"
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <Label>Password</Label>

                      <button
                        type="button"
                        onClick={() => navigate("/forget-password")}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Enter password"
                      onChange={handleChange}
                      className="mt-2 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    {loading ? <Loader className="animate-spin" /> : "Login"}
                  </Button>

                  {/* Signup */}
                  <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="text-black font-medium hover:underline"
                    >
                      Signup
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
