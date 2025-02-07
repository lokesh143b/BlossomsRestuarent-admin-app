import React, { useState } from "react";
import "./Admin.css";
import AddItems from "../../components/AddItems/AddItems";
import ListItems from "../../components/ListItems/ListItems";
import AdminOrders from "../../components/AdminOrders/AdminOrders";
import TableQrcodes from "../../components/TableQrcodes/TableQrcodes";
import OrdersByDate from "../../components/OrdersByDate/OrdersByDate";
import { BsQrCode } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { MdReceiptLong, MdFormatListBulleted } from "react-icons/md";
import { MdAddBox, MdLibraryAdd } from "react-icons/md";

const Admin = () => {
  const [panel, setPanel] = useState();

  const onClickPanel = (type) => {
    setPanel(type);
  };

  const renderComponent = () => {
    switch (panel) {
      case "add-items":
        return <AddItems />;
      case "list-items":
        return <ListItems />;
      case "orders":
        return <AdminOrders />;
      case "table-qr-codes":
        return <TableQrcodes />;
      case "orders-by-date":
        return <OrdersByDate />;
      default:
        // return <h1 className="select-option">Select an option</h1>;
        return (
          <div className="heading-container">
            <h1 className="home-heading">
              Welcome To&nbsp;
              <div className="main-heading">
                <span>B</span>
                <span>l</span>
                <span>o</span>
                <span>s</span>
                <span>s</span>
                <span>o</span>
                <span>m</span>
                <span>s</span>
                <span>.</span>
              </div>
              &nbsp;Restuarent
            </h1>
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-heading">
        <span>B</span>
        <span>l</span>
        <span>o</span>
        <span>s</span>
        <span>s</span>
        <span>o</span>
        <span>m</span>
        <span>s</span>
        <span>.</span>
      </div>
      <h3>Admin Panel</h3>
      <div className="admin-bottom">
        <ul>
          <li
            className={panel === "add-items" ? "click-panel" : ""}
            onClick={() => onClickPanel("add-items")}
          >
            <MdLibraryAdd size={25} style={{ fontWeight: "bold" }} /> Add Items
          </li>
          <li
            className={panel === "list-items" ? "click-panel" : ""}
            onClick={() => onClickPanel("list-items")}
          >
            <MdFormatListBulleted size={25} style={{ fontWeight: "bold" }} />{" "}
            List Items
          </li>
          <li
            className={panel === "orders" ? "click-panel" : ""}
            onClick={() => onClickPanel("orders")}
          >
            <MdReceiptLong size={25} style={{ fontWeight: "bold" }} /> Orders
          </li>
          <li
            className={panel === "table-qr-codes" ? "click-panel" : ""}
            onClick={() => onClickPanel("table-qr-codes")}
          >
            <BsQrCode size={25} style={{ fontWeight: "bold" }} /> Table QR Codes
          </li>
          <li
            className={panel === "orders-by-date" ? "click-panel" : ""}
            onClick={() => onClickPanel("orders-by-date")}
          >
            <MdDateRange size={25} style={{ fontWeight: "bold" }} /> Orders by
            Date
          </li>
        </ul>
        <div className="admin-bottom-right">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Admin;
