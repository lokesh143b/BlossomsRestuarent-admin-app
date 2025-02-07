import React, { useContext, useEffect, useState } from "react";
import "./AdminOrders.css";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/admin_assets/assets";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrders = () => {
  const [table, setTable] = useState("");
  const [tablesData, setTablesData] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [isLoaderActivate, setIsLoaderActivate] = useState(false);
  const [isOrderLoaderActivate, setIsOrderLoaderActivate] = useState(false);
  const { backend_url } = useContext(AdminContext);


  // get tables
  const fetchTableData = async () => {
    setIsLoaderActivate(true); // Show loader
    try {
      const response = await fetch(backend_url + "/table/tables");

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTablesData(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setIsLoaderActivate(false); // Hide loader
    }
  };
  useEffect(() => {
    fetchTableData();
  }, []);

  // get table orders
  const onClickOnTable = async (tableId) => {
    setTable(tableId);
    setIsOrderLoaderActivate(true);
    try {
      const response = await fetch(backend_url + "/table/table-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        const tableOrders = result.tableOrders;
        const modifiedTableOrders = [];
        for (const order of tableOrders) {
          modifiedTableOrders.push({
            ...order.orderItem,
            ...order.foodItem,
            orderId: order.orderId,
          });
        }
        console.log(modifiedTableOrders);
        setTableOrders(modifiedTableOrders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOrderLoaderActivate(false); // Hide loader
    }
  };


  const onChangeOrderStatus = async (e, orderId, foodId,index) => {
    const newStatus = e.target.value;
    // Optimistically update UI
    const updatedOrders = tableOrders.map((order) =>
      order.orderId === orderId && order.food === foodId
        ? { ...order, status: newStatus }
        : order
    );
    setTableOrders(updatedOrders);
    try {
      const response = await fetch(backend_url + "/table/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          tableId: table,
          foodId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.log(error);

      // Revert UI changes if API call fails

      const revertedOrders = tableOrders.map((order) =>
        order.orderId === orderId && order.food === foodId
          ? { ...order, status: order.status }
          : order
      );
      setTableOrders(revertedOrders);
    }
  };

  const onclickAddTable = async () => {
    let tableNo = tablesData.length + 1;
    if (tablesData.length === 0) {
      tableNo = 1;
    }
    try {
      const response = await fetch(backend_url + "/table/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableNo }),
      });
      const result = await response.json();
      toast.success(result.message);
      fetchTableData();
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const onClickDeleteTable = async () => {
    let lastTableId = tablesData[tablesData.length - 1]._id;
    try {
      const response = await fetch(backend_url + "/table/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableId: lastTableId }),
      });
      const result = await response.json();
      console.log(result);
      toast.success(result.message);
      fetchTableData();
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error(error);
    }
  };

  return (
    <div className="admin-orders-container">
      <ToastContainer />
      {/* ----------------tables------------- */}
      <div className="add-del-table-container">
        {/* -------add table--------- */}
        <button onClick={onclickAddTable} className="add-del-table-btn">
          <img src={assets.add_icon} alt="" />
          <p>Add Table</p>
        </button>
        {/* ------delete table----------- */}
        <button onClick={onClickDeleteTable} className="add-del-table-btn">
          <MdDelete size={18} color="black" />
          <p>Delete Tables</p>
        </button>
      </div>

      {isLoaderActivate ? (
        <div className="loader-container">
          <div className="circular-loader"></div>
        </div>
      ) : (
        <div className="table-container">
          {tablesData.map((item, index) => {
            return (
              <div
                className={table === item._id ? "selected-table" : null}
                onClick={() => onClickOnTable(item._id)}
                key={index}
              >
                <p>Table {item.tableNo}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------table orders------------*/}
      {/* ----------order loader------------ */}
      {isOrderLoaderActivate ? (
        <div className="loader-container">
          <div className="circular-loader"></div>
        </div>
      ) : (
        <div>
          {tableOrders.length > 0 ? (
            <div className="table-items">
              <div className="table-items-title">
                <p>Items</p>
                <p>Title</p>
                <p>Quantity</p>
                <p>Category</p>
                <p>Update status</p>
              </div>
              <br />
              <hr />
              {tableOrders.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="table-items-title table-items-item">
                      <img src={backend_url + "/images/" + item.image} alt="" />
                      <p>{item.name}</p>
                      <p>{item.quantity}</p>
                      <p>{item.category}</p>
                      <select
                        onChange={(e) =>
                          onChangeOrderStatus(e, item.orderId, item.food , index)
                        }
                        value={item.status}
                        className="cross"
                      > {
                        item.status === "Cancelled" ?
                        <option value="Cancelled">Cancelled</option>
                        :
                        <>
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Served">Served</option>
                        <option value="Cancelled">Cancelled</option>
                        </>
                      }
                        
                      </select>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          ) : (
            <h1 className="list-empty">
              {table === "" ? "Select table" : "Orders list is empty"}
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
