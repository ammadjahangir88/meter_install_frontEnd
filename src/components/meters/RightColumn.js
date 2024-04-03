import React from "react";
import "./index.css";

const RightColumn = ({ selectedItem }) => {
  // Check if selectedItem is null or undefined
  if (!selectedItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="right-column-container">
      <h2>All Meters</h2>

      {selectedItem.length > 0 ? (
        <table className="meter-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>ID</th>
              <th style={{ width: "150px" }}>Application No</th>
              <th style={{ width: "150px" }}>Reference No</th>
              <th style={{ width: "100px" }}>Meter Status</th>
              <th style={{ width: "100px" }}>Green Meter</th>
              <th style={{ width: "150px" }}>New Meter Number</th>
              <th style={{ width: "150px" }}>Old Meter Number</th>
              <th style={{ width: "150px" }}>New Meter Reading</th>
              <th style={{ width: "150px" }}>Connection Type</th>
              <th style={{ width: "100px" }}>San Load</th>
              <th style={{ width: "100px" }}>Bill Month</th>
              <th style={{ width: "100px" }}>Meter Type</th>
              <th style={{ width: "100px" }}>Kwh MF</th>
              <th style={{ width: "100px" }}>Telco</th>
              <th style={{ width: "150px" }}>SIM No</th>
              <th style={{ width: "150px" }}>Signal Strength</th>
              <th style={{ width: "200px" }}>Consumer Name</th>
              <th style={{ width: "200px" }}>Address</th>
              <th style={{ width: "200px" }}>Picture Upload</th>
              <th style={{ width: "100px" }}>Longitude</th>
              <th style={{ width: "100px" }}>Latitude</th>
            </tr>
          </thead>
          <tbody>
            {selectedItem.map((meter) => (
              <tr key={meter.id} className="meter-row">
                <td>{meter.id}</td>
                <td>{meter.APPLICATION_NO}</td>
                <td>{meter.reference_no}</td>
                <td>{meter.status}</td>
                <td>{meter.GREEN_METER}</td>
                <td>{meter.NEW_METER_NUMBER}</td>
                <td>{meter.old_meter_no}</td>
                <td>{meter.NEW_METER_READING}</td>
                <td>{meter.connection_type}</td>
                <td>{meter.sanction_load}</td>
                <td>{meter.bill_month}</td>
                <td>{meter.meter_type}</td>
                <td>{meter.kwh_mf}</td>
                <td>{meter.TELCO}</td>
                <td>{meter.SIM_NO}</td>
                <td>{meter.SIGNAL_STRENGTH}</td>
                <td>{meter["Consumer Name"]}</td>
                <td>{meter.Address}</td>
                <td>{meter.PICTURE_UPLOAD}</td>
                <td>{meter.longitude}</td>
                <td>{meter.latitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No meters found.</p>
      )}
    </div>
  );
};

export default RightColumn;
