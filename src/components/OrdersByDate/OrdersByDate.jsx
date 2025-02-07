import React, { useContext, useState } from "react";
import "./OrdersByDate.css";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const OrdersByDate = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { backend_url } = useContext(AdminContext);
  const navigate = useNavigate()

  // Fetch orders by date
  const fetchOrdersByDate = async () => {
    if (!selectedDate) {
      toast.warning("Please select a date");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${backend_url}/order/get-orders-by-date`, {
        method: "POST", // Changed from GET to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate }), // Fixed body field name
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.ordersData);
        setOrders(result.ordersData); // Fixed: Store orders in state
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="orders-by-date-container">
        <h2>Orders by Date</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchOrdersByDate} disabled={isLoading}>
          {isLoading ? "Loading..." : "Fetch Orders"}
        </button>

        {isLoading ? (
          <div className="loader-container">
            <div className="circular-loader"></div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.length > 0 ? (
              <div className="orders-table">
                <div className="orders-header">
                  <p>Order ID</p>
                  <p>Table No</p>
                  <p>Customer</p>
                  <p>Email</p>
                  <p>Total Price</p>
                </div>
                <hr />
                {orders.map((order) => (
                 
                    <div onClick={()=> navigate("/order-details")} key={order.order._id} className="orders-row">
                      <p>{order.order._id}</p>
                      <p>{order.table.tableNo}</p>
                      <p>{order.user.name}</p>
                      <p>{order.user.email}</p>
                      <p>₹ {order.order.totalAmount}</p>
                    </div>
                  
                ))}
              </div>
            ) : (
              <h3>No orders found for this date</h3>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersByDate;
