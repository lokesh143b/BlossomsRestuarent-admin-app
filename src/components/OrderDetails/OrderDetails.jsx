import React, { useContext } from "react";
import "./OrderDetails.css";
import { AdminContext } from "../../context/AdminContext";

const OrderDetails = (props) => {
  const { OrderDetails } = props;
  const { backend_url } = useContext(AdminContext);
  console.log(OrderDetails);

  return (
    <div className="order-details-container">
      order details
      <div className="order-details-image-container">
        {OrderDetails.items.map((item, index) => {
          return (
            <img
              src={backend_url + "/images/" + item.foodDetails.image}
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetails;
