import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminOrder = () => {
  const { serverUrl } = useContext(ApiContext);
  const { userId } = useParams();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userAllData") || "{}");
  const accessToken = user?.accessToken;

  const getOrders = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/order/get-user-all-orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const statusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <CheckCircle size={18} />;

      case "failed":
        return <XCircle size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold">All Orders</h1>

        <p className="text-gray-500 mt-1">Total Orders :{orders.length}</p>
      </div>

      <div className="space-y-6 mt-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            {/* TOP */}

            <div className="bg-gray-50 border-b p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h2 className="font-bold">Order ID</h2>

                <p className="text-gray-500 text-sm break-all">{order._id}</p>
              </div>

              <div>
                <h2 className="font-bold">Customer</h2>

                <p>
                  {order?.user?.firstName} {order?.user?.lastName}
                </p>

                <p className="text-gray-500 text-sm">{order?.user?.email}</p>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${statusColor(
                    order.status,
                  )}`}
                >
                  {statusIcon(order.status)}

                  {order.status}
                </span>
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="p-5 space-y-4">
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 border rounded-2xl p-4"
                >
                  <img
                    src={item?.productId?.productImg?.[0]?.url}
                    alt=""
                    className="h-28 w-28 rounded-xl object-cover border"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item?.productId?.productName}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Quantity :{item.quantity}
                    </p>

                    <p className="text-2xl font-bold mt-2">
                      ₹{item?.productId?.productPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM */}

            <div className="border-t bg-gray-50 p-5">
              <div className="grid md:grid-cols-4 gap-5">
                <div>
                  <p className="text-gray-500">Amount</p>

                  <h3 className="font-bold">₹{order.amount}</h3>
                </div>

                <div>
                  <p className="text-gray-500">Tax</p>

                  <h3 className="font-bold">₹{order.tax}</h3>
                </div>

                <div>
                  <p className="text-gray-500">Shipping</p>

                  <h3 className="font-bold">₹{order.shipping}</h3>
                </div>

                <div>
                  <p className="text-gray-500">Date</p>

                  <h3 className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!orders.length && (
          <div className="bg-white rounded-3xl p-20 text-center">
            <Package size={60} className="mx-auto text-gray-300" />

            <h2 className="text-2xl font-bold mt-5">No Orders Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
