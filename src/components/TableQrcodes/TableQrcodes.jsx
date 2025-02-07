import React, { useContext, useEffect, useState, useRef } from "react";
import "./TableQrcodes.css";
import { QRCodeCanvas } from "qrcode.react";
import { AdminContext } from "../../context/AdminContext";

const TableQrcodes = () => {
  const { backend_url } = useContext(AdminContext);
  const [tablesData, setTablesData] = useState([]);
  const qrRefs = useRef({});

  // Fetch table data
  const fetchTableData = async () => {
    try {
      const response = await fetch(backend_url + "/table/tables");
      const data = await response.json();
      console.log(data)
      setTablesData(data.data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Download QR Code
  const handleDownload = (tableNo) => {
    const canvas = qrRefs.current[tableNo]?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Table-${tableNo}-QRCode.png`;
      link.click();
    }
  };

  // Print QR Code
  const handlePrint = (tableNo) => {
    const canvas = qrRefs.current[tableNo]?.querySelector("canvas");
    if (canvas) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write("<html><head><title>Print QR Code</title></head><body>");
      printWindow.document.write(`<img src="${canvas.toDataURL("image/png")}" width="200"/>`);
      printWindow.document.write(`<p>Table No: ${tableNo}</p>`);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="qrcodes-container">
      {tablesData.map((table) => (
        <div className="qrcode" key={table._id} ref={(el) => (qrRefs.current[table.tableNo] = el)}>
          <QRCodeCanvas value={`${backend_url}/${table.tableNo}/${table._id}`} size={200} />
          <p>Table No: {table.tableNo}</p>
          <button className="qr-download-btn" onClick={() => handleDownload(table.tableNo)}>Download</button>
          <button className="qr-print-btn" onClick={() => handlePrint(table.tableNo)}>Print</button>
        </div>
      ))}
    </div>
  );
};

export default TableQrcodes;

// import React, { useContext, useEffect, useState } from "react";
// import "./TableQrcodes.css";
// import { QRCodeSVG } from "qrcode.react";
// import { AdminContext } from "../../context/AdminContext";

// const TableQrcodes = () => {
//   const { backend_url } = useContext(AdminContext);
//   const [tablesData, setTablesData] = useState([]);

//   // get tables
//   const fetchTableData = async () => {
//     try {
//       const response = await fetch(backend_url + "/table/tables");
//       const data = await response.json();
//       console.log(data);
//       setTablesData(data.data || []);
//     } catch (error) {
//       console.error("Error fetching tables:", error);
//     }
//   };
//   useEffect(() => {
//     fetchTableData();
//   }, []);

//   console.log(tablesData);
//   return (
//     <div className="qrcodes-container">
//       {tablesData.map((table , index) => {
//         return(
//             <div className="qrcode" key={index}>
//                 <QRCodeSVG  value={backend_url + "/" + table.tableNo + "/" + table._id} size={200} />
//                 <p>Table No : {table.tableNo}</p>
//             </div>
//         ) 
//       })}
//     </div>
//   );
// };

// export default TableQrcodes;
