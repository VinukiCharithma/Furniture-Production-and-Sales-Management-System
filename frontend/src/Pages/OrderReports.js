import React, { useEffect, useState } from "react";
import { generateOrderReports } from "../Services/orderService";

const OrderReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const reports = await generateOrderReports();
      setReports(reports);
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Order Reports</h2>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            Status: {report._id} - Total Sales: ${report.totalSales}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderReports;