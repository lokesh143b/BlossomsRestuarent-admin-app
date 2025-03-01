import React, { createContext } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  // const frontend_url = "http://localhost:5174"
  // const backend_url = "http://localhost:4000"

  const frontend_url = "https://blossoms-restuarent-app.netlify.app";
  const backend_url = "https://blossoms-backend-app.onrender.com";
  return (
    <AdminContext.Provider value={{ frontend_url, backend_url }}>
      {children}
    </AdminContext.Provider>
  );
};
