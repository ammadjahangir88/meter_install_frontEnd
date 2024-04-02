import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import axiosInstance from "../utils/Axios";
import MeterModal from "./meterModal/MeterModal";
import { FaPlus, FaSearch } from "react-icons/fa";
const LeftColumn = ({
  data,
  onItemClick,
  onDiscosClick,
  onDivisionClick,
  onAllClick,
}) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedDivisions, setExpandedDivisions] = useState([]);

  useEffect(() => {
    // Expand the "Discos" items by default
    const discosIds = data.map((item) => item.id);
    setExpandedItems(discosIds);
    const divisionsIds = data.flatMap((disco) =>
      disco.divisions.map((division) => division.id)
    );
    setExpandedDivisions(divisionsIds);
  }, [data]);

  const toggleItem = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const toggleDivision = (divisionId) => {
    if (expandedDivisions.includes(divisionId)) {
      setExpandedDivisions(expandedDivisions.filter((id) => id !== divisionId));
    } else {
      setExpandedDivisions([...expandedDivisions, divisionId]);
    }
  };

  const renderTreeItem = (item) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.divisions && item.divisions.length > 0;

    return (
      <div key={item.id} className="tree-item" style={{ marginLeft: "10px" }}>
        <div
          className="tree-item-header"
          style={{ cursor: "pointer" }}
          onClick={() => {
            onDiscosClick(item);
            toggleItem(item.id);
          }}
        >
          {hasChildren ? (isExpanded ? "▼" : "►") : ""} {item.name}
        </div>
        {isExpanded &&
          hasChildren &&
          item.divisions.map((division) => (
            <div
              key={division.id}
              className="tree-sub-item"
              style={{ marginLeft: "20px" }}
            >
              <div
                className="tree-sub-item-header"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onDivisionClick(division);
                  toggleDivision(division.id);
                }}
              >
                {division.subdivisions && division.subdivisions.length > 0
                  ? expandedDivisions.includes(division.id)
                    ? "▼"
                    : "►"
                  : ""}{" "}
                {division.name}
              </div>
              {expandedDivisions.includes(division.id) &&
                division.subdivisions &&
                division.subdivisions.map((subdivision) => (
                  <div
                    key={subdivision.id}
                    className="tree-sub-sub-item"
                    style={{ marginLeft: "30px" }}
                  >
                    <div
                      className="tree-sub-sub-item-header"
                      style={{ cursor: "pointer" }}
                      onClick={() => onItemClick(subdivision)}
                    >
                      {subdivision.name}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    );
  };

  // Check if data is null or undefined
  if (!data) {
    return null; // or return loading indicator if needed
  }

  return (
    <div className="left-column">
      <h3
        onClick={() => {
          const allMeters = data.flatMap((disco) =>
            disco.divisions.flatMap((division) =>
              division.subdivisions.flatMap((subdivision) => subdivision.meters)
            )
          );

          onAllClick(allMeters);
        }}
      >
        All
      </h3>
      {data.map((item) => renderTreeItem(item))}
    </div>
  );
};

const RightColumn = ({ selectedItem }) => {
  console.log("selectedItem:", selectedItem);

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
              <th>ID</th>
              <th>Meter No</th>
              <th>Reference No</th>
              <th>Status</th>
              <th>Old Meter No</th>
              <th>Old Meter Reading</th>
              <th>New Meter Reading</th>
              <th>Connection Type</th>
              <th>Bill Month</th>
              <th>Longitude</th>
              <th>Latitude</th>
              <th>Meter Type</th>
              <th>Kwh MF</th>
              <th>Sanction Load</th>
              <th>Full Name</th>
              <th>Address</th>
              <th>QC Check</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(selectedItem)
              ? selectedItem.map((meter) => (
                  <tr key={meter.id} className="meter-row">
                    <td>{meter.id}</td>
                    <td>{meter.meter_no}</td>
                    <td>{meter.reference_no}</td>
                    <td>{meter.status}</td>
                    <td>{meter.old_meter_no}</td>
                    <td>{meter.old_meter_reading}</td>
                    <td>{meter.new_meter_reading}</td>
                    <td>{meter.connection_type}</td>
                    <td>{meter.bill_month}</td>
                    <td>{meter.longitude}</td>
                    <td>{meter.latitude}</td>
                    <td>{meter.meter_type}</td>
                    <td>{meter.kwh_mf}</td>
                    <td>{meter.sanction_load}</td>
                    <td>{meter.full_name}</td>
                    <td>{meter.address}</td>
                    <td>{meter.qc_check ? "Yes" : "No"}</td>
                  </tr>
                ))
              : selectedItem.meters.map((meter) => (
                  <tr key={meter.id} className="meter-row">
                    <td>{meter.id}</td>
                    <td>{meter.meter_no}</td>
                    <td>{meter.reference_no}</td>
                    <td>{meter.status}</td>
                    <td>{meter.old_meter_no}</td>
                    <td>{meter.old_meter_reading}</td>
                    <td>{meter.new_meter_reading}</td>
                    <td>{meter.connection_type}</td>
                    <td>{meter.bill_month}</td>
                    <td>{meter.longitude}</td>
                    <td>{meter.latitude}</td>
                    <td>{meter.meter_type}</td>
                    <td>{meter.kwh_mf}</td>
                    <td>{meter.sanction_load}</td>
                    <td>{meter.full_name}</td>
                    <td>{meter.address}</td>
                    <td>{meter.qc_check ? "Yes" : "No"}</td>
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

const Index = () => {
  const [metreModal, setMetreModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [data, setDiscosData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/v1/discos");
        setDiscosData(response.data);

        // Extract all meters from the data
        const allMeters = response.data.flatMap((disco) =>
          disco.divisions.flatMap((division) =>
            division.subdivisions.flatMap((subdivision) => subdivision.meters)
          )
        );

        // Set the selected item to all meters initially
        setSelectedItem(allMeters);

        console.log("All Meters:", allMeters); // Log the final allMeters array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item.meters);
  };
  const handleDivisionClick = (item) => {
    const divisionMeters = item.subdivisions.flatMap(
      (subdivision) => subdivision.meters
    );
    setSelectedItem(divisionMeters);
  };
  const handleAllData = (item) => {
    setSelectedItem(item);
  };
  const handleDiscosClick = (disco) => {
    // Get meters of the clicked Disco
    const discoMeters = disco.divisions.flatMap((division) =>
      division.subdivisions.flatMap((subdivision) => subdivision.meters)
    );
    setSelectedItem(discoMeters);
  };
  function filterData(searchText, data) {
    console.log(data);

    const filteredData = data.filter((item) => {
      // Convert reference number and searchText to lowercase for case-insensitive comparison
      const referenceNo = item.reference_no.toLowerCase();
      const searchTerm = searchText.toLowerCase();
      // Check if the reference number includes the searchText
      return referenceNo.includes(searchTerm);
    });
    console.log(filteredData);
    return filteredData; // Return filtered data instead of the function itself
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 0.3, height: "100%" }}>
        <LeftColumn
          data={data}
          onAllClick={handleAllData}
          onDiscosClick={handleDiscosClick}
          onDivisionClick={handleDivisionClick}
          onItemClick={handleItemClick}
        />
      </div>
      <div style={{ flex: 1.7 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{display:'flex',flexDirection:'row'}}>
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <button
              className="custom-button"
              onClick={() => {
                const filteredData = filterData(searchText, selectedItem);
                setSelectedItem(filteredData);
              }}
            >
              Search
            </button>
          </div>
          <div
            className="PlusIcon"
            onClick={() => setMetreModal((pre) => !pre)}
          >
            <FaPlus className="add-icon" />
          </div>
        </div>
        {metreModal && (
          <MeterModal
            data={data}
            isOpen={metreModal}
            setIsOpen={setMetreModal}
          />
        )}
        <RightColumn selectedItem={selectedItem} />
      </div>
    </div>
  );
};

export default Index;
