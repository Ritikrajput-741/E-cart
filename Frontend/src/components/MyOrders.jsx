import { ApiContext } from "@/context/ApiProvider";
import axios from "axios";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(ApiContext);
  const product = useSelector((store) => store.product.product);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("userAllData") || "{}");
  const token = userData?.accessToken;
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/order/get-order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <CheckCircle size={16} />;

      case "failed":
        return <XCircle size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <h1 className="text-xl font-semibold">Loading Orders...</h1>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="h-60 flex items-center justify-center border rounded-xl">
        <h1 className="text-2xl font-semibold text-gray-400">No Orders Yet</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full border hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {/* ORDERS */}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded-2xl shadow-sm overflow-hidden"
        >
          {/* TOP */}

          <div className="p-5 border-b bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-bold">Order ID</h2>

                <p className="text-sm text-gray-500 break-all">{order._id}</p>
              </div>

              <div>
                <h2 className="font-bold">Customer</h2>

                <p>
                  {order?.user?.firstName} {order?.user?.lastName}
                </p>

                <p className="text-sm text-gray-500">{order?.user?.email}</p>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {getStatusIcon(order.status)}

                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}

          <div className="p-5 space-y-4" onClick={() => navigate(`/product/${product[0]._id}`)}>
            {order.products.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 border rounded-xl p-4"
              >
                <img
                  src={item?.productId?.productImg?.[0]?.url}
                  alt="product"
                  className="h-28 w-28 object-cover rounded-xl border"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {item?.productId?.productName}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Quantity : {item.quantity}
                  </p>

                  <p className="mt-1 font-bold text-xl">
                    ₹{item?.productId?.productPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}

          <div className="border-t p-5 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <p className="text-gray-500">Ordered On</p>

                <h3 className="font-bold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
