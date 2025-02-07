import React, { useContext, useEffect, useState } from "react";
import "./ListItems.css";
import { food_list } from "../../../../frontend/src/assets/frontend_assets/assets";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "../../context/AdminContext";

const ListItems = () => {
  const [foodList, setFoodList] = useState([]);
  const [isLoaderActivate, setIsLoaderActivate] = useState(false);
  const { backend_url } = useContext(AdminContext);

  // fetching food list
  const fetchData = async () => {
    setIsLoaderActivate(true);
    try {
      const response = await fetch(backend_url + "/food/list");
      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        console.log(result);
        setFoodList(result.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoaderActivate(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // remove food item
  const deleteFoodItem = async (foodId) => {
    try {
      const response = await fetch(backend_url + "/food/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: foodId }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        const filtered_list = foodList.filter((item) => item._id !== foodId);
        setFoodList(filtered_list);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ToastContainer />
      {isLoaderActivate ? (
        <div className="loader-container">
          <div className="circular-loader"></div>
        </div>
      ) : (
        <div className="list-items-container">
          {foodList.length > 0 ? (
            <div className="list-items">
              <div className="list-items-title">
                <p>Items</p>
                <p>Title</p>
                <p>Price</p>
                <p>Category</p>
                <p>Remove</p>
              </div>
              <br />
              <hr />
              {foodList.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="list-items-title list-items-item">
                      <img src={`${backend_url}/images/${item.image}`} alt="" />
                      <p>{item.name}</p>
                      <p>₹ {item.price}</p>
                      <p>{item.category}</p>
                      <p
                        className="cross"
                        onClick={() => deleteFoodItem(item._id)}
                      >
                        <MdDelete size={18} />
                      </p>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          ) : (
            <h1 className="list-empty">Your list is empty add items</h1>
          )}
        </div>
      )}
    </>
  );
};

export default ListItems;
