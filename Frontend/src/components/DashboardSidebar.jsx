import {
  BadgeDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [openSidebar, setOpenSidebar] = useState(false);

  const menuItems = [
    {
      name: "Sales",
      path: "/dashboard/sales",
      icon: <BadgeDollarSign size={20} />,
    },
    {
      name: "Add Product",
      path: "/dashboard/add-product",
      icon: <PackagePlus size={20} />,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: <Package size={20} />,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <Users size={20} />,
    },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("userAllData");

    navigate("/login");
  };

  return (
    <>
      {/* MOBILE HEADER */}

      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-xl">
            <LayoutDashboard size={22} />
          </div>

          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className="bg-black text-white p-2 rounded-xl"
        >
          {openSidebar ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* SIDEBAR */}

      <div
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-[260px] sm:w-[280px]
          bg-black text-white
          p-5
          flex flex-col justify-between
          transition-all duration-300

          ${
            openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* TOP */}

        <div>
          {/* LOGO */}

          <div className="hidden lg:flex items-center gap-3 mb-12">
            <div className="bg-yellow-400 text-black p-3 rounded-2xl">
              <LayoutDashboard size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>

              <p className="text-gray-400 text-sm">Admin Panel</p>
            </div>
          </div>

          {/* MENU */}

          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setOpenSidebar(false)}
                className={`
                  flex items-center gap-4
                  px-4 py-3
                  rounded-2xl
                  transition-all duration-300

                  ${
                    location.pathname === item.path
                      ? "bg-yellow-400 text-black"
                      : "hover:bg-gray-800"
                  }
                `}
              >
                {item.icon}

                <span className="text-base font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* BOTTOM */}

        <div className="space-y-4">
          {/* CARD */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-lg font-bold">Admin Panel</h2>

            <p className="text-gray-400 text-sm mt-2 leading-6">
              Manage products, users and orders.
            </p>
          </div>

          {/* LOGOUT */}

          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-3 rounded-2xl transition-all duration-300"
          >
            <LogOut size={18} />

            <span className="text-base font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* OVERLAY */}

      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default DashboardSidebar;
