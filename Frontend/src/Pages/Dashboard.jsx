import DashboardSidebar from "@/components/DashboardSidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
