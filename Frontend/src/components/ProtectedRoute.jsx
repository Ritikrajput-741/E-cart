import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userAllData") || "{}");

  // only check login
  if (!userData?.user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
