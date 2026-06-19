import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from "./Pages/AboutPage";
import Address from "./Pages/Address";
import AddProduct from "./Pages/Admin/AddProduct";
import AdminOrder from "./Pages/Admin/AdminOrder";
import AdminProduct from "./Pages/Admin/AdminProduct";
import AdminSales from "./Pages/Admin/AdminSales";
import AdminUsers from "./Pages/Admin/AdminUsers";
import ShowUserOrders from "./Pages/Admin/ShowUserOrders";
import UserInfo from "./Pages/Admin/UserInfo";
import Cart from "./Pages/Cart";
import Dashboard from "./Pages/Dashboard";
import ForgetPassword from "./Pages/ForgetPassword";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import NewPassword from "./Pages/NewPassword";
import OrderSuccess from "./Pages/OrderSuccess";
import Product from "./Pages/Product";
import ProductDetails from "./Pages/ProductDetails";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import Verify from "./Pages/Verify";
import VerifyEmail from "./Pages/VerifyEmail";
import VerifyOtp from "./Pages/VerifyOtp";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: (
      <ProtectedRoute>
        <Navbar />
        <AboutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Product />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <ProtectedRoute>
        <Navbar />
        <ProductDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/address",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Address />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-success",
    element: (
      <ProtectedRoute>
        <OrderSuccess />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify",
    element: <Verify />,
  },

  {
    path: "/verify/:token",
    element: <VerifyEmail />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/reset-password",
    element: <NewPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <Navbar />
        <Dashboard />
      </AdminRoute>
    ),
    children: [
      {
        path: "sales",
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrder />,
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "user/:id",
        element: <UserInfo />,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="bottom-right" />
    </>
  );
};

export default App;
