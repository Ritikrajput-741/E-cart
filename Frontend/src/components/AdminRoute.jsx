import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userAllData") || "{}");

  // not login
  if (!userData?.user) {
    return <Navigate to="/login" />;
  }

  // not admin
  if (userData.user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
