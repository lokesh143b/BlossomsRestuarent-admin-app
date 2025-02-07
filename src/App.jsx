import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./Pages/Admin/Admin";
import OrderDetails from "././components/OrderDetails/OrderDetails"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/order-details" element={<OrderDetails/>} />
      </Routes>
    </div>
  );
};

export default App;
