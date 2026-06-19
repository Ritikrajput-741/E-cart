import { ApiContext } from "@/context/ApiProvider";
import { clearUser } from "@/Redux/Slice/userSlice";
import axios from "axios";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serverUrl } = useContext(ApiContext);
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.product.cart);
  const products = useSelector((store) => store.product.product);
  const userData = JSON.parse(localStorage.getItem("userAllData") || "{}");
  const token = userData?.accessToken;
  const admin = user?.role === "admin";

  /* SEARCH FILTER */
  const filteredProducts = products.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase()),
  );

  /* LOGOUT HANDLER */
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        localStorage.removeItem("userAllData");
        dispatch(clearUser());
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[80px] flex items-center justify-between">
            {/* LEFT */}

            <div className="flex items-center gap-12">
              {/* LOGO */}

              <Link to="/" className="flex items-center gap-3">
                <div className="bg-yellow-400 p-2 rounded-2xl shadow-sm">
                  <ShoppingBag size={28} className="text-black" />
                </div>

                <h1 className="text-3xl font-black tracking-tight">
                  E-
                  <span className="text-yellow-400">CART</span>
                </h1>
              </Link>

              {/* DESKTOP MENU */}

              <div className="hidden lg:flex items-center gap-8">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-[16px] font-medium transition-all duration-300 ${
                      isActive
                        ? "text-black border-b-2 border-yellow-400 pb-1"
                        : "text-gray-700 hover:text-black"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `text-[16px] font-medium transition-all duration-300 ${
                      isActive
                        ? "text-black border-b-2 border-yellow-400 pb-1"
                        : "text-gray-700 hover:text-black"
                    }`
                  }
                >
                  Products
                </NavLink>

                {admin && (
                  <NavLink
                    to="/dashboard/sales"
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-[16px] font-medium transition-all duration-300 ${
                        isActive
                          ? "text-black border-b-2 border-yellow-400 pb-1"
                          : "text-gray-700 hover:text-black"
                      }`
                    }
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </NavLink>
                )}
              </div>
            </div>

            {/* RIGHT */}

            <div className="hidden lg:flex items-center gap-4">
              {/* SEARCH */}

              <div className="relative">
                <Search
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[260px] bg-gray-100 border border-transparent focus:border-black rounded-2xl py-3 pl-12 pr-4 outline-none transition-all duration-300"
                />

                {/* SEARCH RESULT */}

                {search && (
                  <div className="absolute top-16 left-0 w-full bg-white shadow-2xl rounded-2xl max-h-[350px] overflow-y-auto z-50 border">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            navigate(`/product/${product._id}`);

                            setSearch("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
                        >
                          <img
                            src={product?.productImg?.[0]?.url}
                            alt="product"
                            className="h-14 w-14 object-cover rounded-xl"
                          />

                          <div>
                            <h1 className="font-semibold line-clamp-1">
                              {product.productName}
                            </h1>

                            <p className="text-sm text-gray-500">
                              ₹{product.productPrice}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-gray-500">No product found</p>
                    )}
                  </div>
                )}
              </div>

              {/* PROFILE */}

              {user && (
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="flex items-center gap-3 bg-gray-100 hover:bg-yellow-400 transition-all duration-300 px-4 py-2 rounded-2xl"
                >
                  <div className="bg-white rounded-full p-1">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <CgProfile size={24} />
                    )}
                  </div>

                  <span className="font-semibold capitalize">
                    {user.firstName}
                  </span>
                </button>
              )}

              {/* CART */}

              <button
                onClick={() => navigate("/cart")}
                className="relative bg-gray-100 hover:bg-yellow-400 transition-all duration-300 p-3 rounded-2xl"
              >
                <ShoppingCart size={24} />

                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {cart?.items?.length || 0}
                </span>
              </button>

              {/* LOGIN LOGOUT */}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-black hover:bg-yellow-400 hover:text-black text-white transition-all duration-300 px-5 py-3 rounded-2xl font-semibold"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-black hover:bg-yellow-400 hover:text-black text-white transition-all duration-300 px-5 py-3 rounded-2xl font-semibold"
                >
                  Login
                </button>
              )}
            </div>

            {/* MOBILE */}

            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => navigate("/cart")}
                className="relative bg-gray-100 p-3 rounded-2xl"
              >
                <ShoppingCart size={22} />

                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {cart?.items?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-gray-100 p-3 rounded-2xl"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[500px] border-t" : "max-h-0"
          }`}
        >
          <div className="px-5 py-5 bg-white space-y-5">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none"
              />

              {/* MOBILE SEARCH RESULT */}

              {search && (
                <div className="bg-white rounded-2xl shadow-xl mt-3 border max-h-[300px] overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/product/${product._id}`);

                          setSearch("");

                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 border-b"
                      >
                        <img
                          src={product?.productImg?.[0]?.url}
                          alt="product"
                          className="h-12 w-12 rounded-xl object-cover"
                        />

                        <div>
                          <h1 className="font-medium line-clamp-1">
                            {product.productName}
                          </h1>

                          <p className="text-sm text-gray-500">
                            ₹{product.productPrice}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500">No product found</p>
                  )}
                </div>
              )}
            </div>

            {/* LINKS */}

            <div className="flex flex-col gap-5">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium ${
                    isActive ? "text-yellow-500" : "text-gray-700"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium ${
                    isActive ? "text-yellow-500" : "text-gray-700"
                  }`
                }
              >
                Products
              </NavLink>

              {admin && (
                <NavLink
                  to="/dashboard/sales"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 font-medium ${
                      isActive ? "text-yellow-500" : "text-gray-700"
                    }`
                  }
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>
              )}

              {user && (
                <button
                  onClick={() => {
                    navigate(`/profile/${user._id}`);

                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3"
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <CgProfile size={28} />
                  )}

                  <span className="font-semibold capitalize">
                    {user.firstName}
                  </span>
                </button>
              )}

              {/* LOGOUT */}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-2xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-black text-white py-3 rounded-2xl"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
