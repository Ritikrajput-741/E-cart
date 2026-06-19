import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import {
  BadgeDollarSign,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Users,
  XCircle,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminSales = () => {
  const { serverUrl } = useContext(ApiContext);

  const [data, setData] = useState(null);

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");

  const accessToken = user?.accessToken;

  const getSalesData = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/order/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSalesData();
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...{" "}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Sales",
      value: `₹${data.totalSales}`,
      icon: <BadgeDollarSign size={28} />,
      bg: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: <ShoppingCart size={28} />,
      bg: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: <Package size={28} />,
      bg: "bg-purple-500",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: <Users size={28} />,
      bg: "bg-orange-500",
    },
  ];

  const orderStatusData = [
    {
      name: "Paid",
      value: data.paidOrders,
    },
    {
      name: "Pending",
      value: data.pendingOrders,
    },
    {
      name: "Failed",
      value: data.failedOrders,
    },
  ];

  const overviewData = [
    {
      name: "Users",
      value: data.totalUsers,
    },
    {
      name: "Products",
      value: data.totalProducts,
    },
    {
      name: "Orders",
      value: data.totalOrders,
    },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {" "}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        {" "}
        <h1 className="text-3xl font-bold">Sales Dashboard </h1>
        ```
        <p className="text-gray-500 mt-1">Overview of your store</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {cards.map((item, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-sm p-6">
            <div
              className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white ${item.bg}`}
            >
              {item.icon}
            </div>

            <h2 className="text-gray-500 mt-5">{item.title}</h2>

            <h1 className="text-3xl font-bold mt-2">{item.value}</h1>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <h2 className="font-semibold">Paid Orders</h2>
          </div>

          <h1 className="text-4xl font-bold text-green-500 mt-4">
            {data.paidOrders}
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-500" />
            <h2 className="font-semibold">Pending Orders</h2>
          </div>

          <h1 className="text-4xl font-bold text-yellow-500 mt-4">
            {data.pendingOrders}
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" />
            <h2 className="font-semibold">Failed Orders</h2>
          </div>

          <h1 className="text-4xl font-bold text-red-500 mt-4">
            {data.failedOrders}
          </h1>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Order Status</h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                outerRadius={120}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Store Overview</h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={overviewData}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

        <div className="space-y-4">
          {data.recentOrders?.map((order) => (
            <div
              key={order._id}
              className="border rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">
                  {order?.user?.firstName} {order?.user?.lastName}
                </h3>

                <p className="text-sm text-gray-500">{order?.user?.email}</p>
              </div>

              <div>
                <p className="font-semibold">₹{order.amount}</p>
              </div>

              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
