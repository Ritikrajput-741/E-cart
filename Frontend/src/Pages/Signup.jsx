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

import axios from "axios";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const { serverUrl } = useContext(ApiContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/register`,
        userData,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        console.log(res.data.newUser);
        navigate("/verify");
        toast.success(res.data.message);
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
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">E-Shop</span>
          </h1>

          <p className="mt-5 text-gray-300 text-lg">
            Create your account and start shopping amazing products with
            exclusive deals and offers.
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
                Create Account
              </CardTitle>

              <CardDescription className="text-center">
                Sign up to continue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* First Name */}
                  <div>
                    <Label>First Name</Label>

                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label>Last Name</Label>

                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>

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
                    <Label>Password</Label>

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
                      className="absolute right-3 top-7 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => navigate("/forget-password")}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    {loading ? <Loader className="animate-spin" /> : "Sign Up"}
                  </Button>

                  {/* Login */}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-black font-medium hover:underline"
                    >
                      Login
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

export default Signup;
