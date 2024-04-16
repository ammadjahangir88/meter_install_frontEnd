import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import axiosInstance from "../utils/Axios";
import MeterModal from "./meterModal/MeterModal";
import { FaPlus, FaSearch } from "react-icons/fa";

import RightColumn from "./RightColumn.js";

// Main LeftColumn component function
const LeftColumn = ({
  data,
  onItemClick,
  onDiscosClick,
  onDivisionClick,
  onRegionClick,
  setSelectedItem,
  selectedItemId
}) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedDivisions, setExpandedDivisions] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState([]);

  // Function to toggle expansion of items
  const toggleItemExpansion = (items, setItems, itemId) => {
    if (items.includes(itemId)) {
      setItems(items.filter(id => id !== itemId));
    } else {
      setItems([...items, itemId]);
    }
  };

  // Function to set the selected item with a type prefix
  const handleSetSelectedItem = (id, type) => {
    setSelectedItem(`${type}-${id}`);
  };

  // Render a subdivision item within a division
  const renderSubdivisionItem = (subdivision) => {
    const isSelected = selectedItemId === `subdivision-${subdivision.id}`;

    return (
      <div key={subdivision.id} className="tree-sub-sub-sub-item" style={{ marginLeft: "40px" }}>
        <div
          className={`tree-sub-sub-sub-item-header ${isSelected ? "highlighted" : ""}`}
          onClick={() => {
            onItemClick(subdivision);
            handleSetSelectedItem(subdivision.id, 'subdivision');
          }}
        >
          {subdivision.name}
        </div>
      </div>
    );
  };

  // Render a division item within a region
  const renderDivisionItem = (division) => {
    const isExpanded = expandedDivisions.includes(division.id);
    const isSelected = selectedItemId === `division-${division.id}`;

    return (
      <div key={division.id} className="tree-sub-sub-item" style={{ marginLeft: "30px" }}>
        <div
          className={`tree-sub-sub-item-header ${isSelected ? "highlighted" : ""}`}
          onClick={() => {
            onDivisionClick(division);
            toggleItemExpansion(expandedDivisions, setExpandedDivisions, division.id);
            handleSetSelectedItem(division.id, 'division');
          }}
        >
          {division.subdivisions && division.subdivisions.length > 0 ? (isExpanded ? "▼" : "►") : ""} {division.name}
        </div>
        {isExpanded && division.subdivisions.map(subdivision => renderSubdivisionItem(subdivision))}
      </div>
    );
  };

  // Render a region item within a disco
  const renderRegionItem = (region) => {
    const isExpanded = expandedRegions.includes(region.id);
    const isSelected = selectedItemId === `region-${region.id}`;

    return (
      <div key={region.id} className="tree-sub-item" style={{ marginLeft: "20px" }}>
        <div
          className={`tree-sub-item-header ${isSelected ? "highlighted" : ""}`}
          onClick={() => {
            onRegionClick(region);
            toggleItemExpansion(expandedRegions, setExpandedRegions, region.id);
            handleSetSelectedItem(region.id, 'region');
          }}
        >
          {region.divisions && region.divisions.length > 0 ? (isExpanded ? "▼" : "►") : ""} {region.name}
        </div>
        {isExpanded && region.divisions.map(division => renderDivisionItem(division))}
      </div>
    );
  };

  // Render a disco item at the top level
  const renderTreeItem = (item) => {
    const isExpanded = expandedItems.includes(item.id);
    const isSelected = selectedItemId === `disco-${item.id}`;

    return (
      <div key={item.id} className="tree-item" style={{ marginLeft: "10px" }}>
        <div
          className={`tree-item-header ${isSelected ? "highlighted" : ""}`}
          onClick={() => {
            onDiscosClick(item);
            toggleItemExpansion(expandedItems, setExpandedItems, item.id);
            handleSetSelectedItem(item.id, 'disco');
          }}
        >
          {item.regions && item.regions.length > 0 ? (isExpanded ? "▼" : "►") : ""} {item.name}
        </div>
        {isExpanded && item.regions.map(region => renderRegionItem(region))}
      </div>
    );
  };

  if (!data) {
    return null;
  }

  return (
    <div className="left-column">
      {data.map(renderTreeItem)}
    </div>
  );
};


const Index = () => {
  const [metreModal, setMetreModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [data, setDiscosData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [displayTree, setDisplayTree] = useState(true); // State to control the display mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/v1/discos");
        setDiscosData(response.data);

        // Extract all meters from the data
        const allMeters = response.data.flatMap((disco) =>
          disco.regions.flatMap((region) =>
            region.divisions.flatMap((division) =>
              division.subdivisions.flatMap((subdivision) => subdivision.meters)
            )
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

  const handleRegionClick = (item) => {
    // Extract all meters from the clicked region
    const regionMeters = item.divisions.flatMap((division) =>
      division.subdivisions.flatMap((subdivision) => subdivision.meters)
    );
    console.log(regionMeters);
    // Set the selected item to the meters of the clicked region
    setSelectedItem(regionMeters);
  };

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
    console.log(disco);
    // Get meters of the clicked Disco
    const discoMeters = disco.regions.flatMap((region) =>
      region.divisions.flatMap((division) =>
        division.subdivisions.flatMap((subdivision) => subdivision.meters)
      )
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedItem.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 0.3, width: "100%", height: "100%" }}>
        <LeftColumn
          data={data}
          setSelectedItem={setSelectedItemId} // Make sure this is correct
          selectedItemId={selectedItemId}
          onDiscosClick={handleDiscosClick}
          onDivisionClick={handleDivisionClick}
          onRegionClick={handleRegionClick}
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            {displayTree && ( // Conditionally render table view button when in tree view mode
              <button onClick={() => setDisplayTree(false)}>Table View</button>
            )}
            {!displayTree && ( // Conditionally render tree view button when in table view mode
              <button onClick={() => setDisplayTree(true)}>Tree View</button>
            )}
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
        {displayTree ? (
          <>
            {/* Render search input and pagination in tree view mode */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  marginRight: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
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

            <RightColumn selectedItem={currentItems} />
            <div className="pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-text">
                Page {currentPage} of{" "}
                {Math.ceil(selectedItem.length / itemsPerPage)}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentItems.length < itemsPerPage}
                className="pagination-button"
              >
                Next
              </button>
            </div>
            {/* Render right column in tree view mode */}
          </>
        ) : (
          <div>{/* Render your table view here */}</div>
        )}
      </div>
    </div>
  );
};

export default Index;
