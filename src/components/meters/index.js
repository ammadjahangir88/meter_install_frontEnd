import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import axiosInstance from "../utils/Axios";
import MeterModal from "./meterModal/MeterModal";
import { FaPlus, FaSearch } from "react-icons/fa";

import RightColumn from './RightColumn.js'

const LeftColumn = ({
  data,
  onItemClick,
  onDiscosClick,
  onDivisionClick,
  onRegionClick, // Add the new prop for region click
  onAllClick,
  selectedItem, // Add selectedItem prop
  setSelectedItem, // Add setSelectedItem prop
}) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedDivisions, setExpandedDivisions] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState([]); // State for expanded regions
  

  useEffect(() => {
    if (data) {
      const discosIds = data.map((item) => item.id);
      setExpandedItems(discosIds);

      const divisionsIds = data.flatMap((disco) =>
        disco.regions.flatMap((region) =>
          region.divisions.map((division) => division.id)
        )
      );
      setExpandedDivisions(divisionsIds);

      const regionsIds = data.flatMap((disco) =>
        disco.regions.map((region) => region.id)
      );
      setExpandedRegions(regionsIds);
    }
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

  const toggleRegion = (regionId) => {
    if (expandedRegions.includes(regionId)) {
      setExpandedRegions(expandedRegions.filter((id) => id !== regionId));
    } else {
      setExpandedRegions([...expandedRegions, regionId]);
    }
  };

  const renderTreeItem = (item) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.regions && item.regions.length > 0;
    const isSelected = selectedItem && selectedItem.id === item.id; 

    return (
      <div key={item.id}          className={`tree-item ${isSelected ? 'selected' : ''}`} style={{ marginLeft: "10px" }}>
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
          item.regions.map((region) => (
            <div
              key={region.id}
              className="tree-sub-item"
              style={{ marginLeft: "20px" }}
            >
              <div
                className="tree-sub-item-header"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onRegionClick(region); // Call onRegionClick
                  toggleRegion(region.id);
                }}
              >
                {region.divisions && region.divisions.length > 0
                  ? expandedRegions.includes(region.id)
                    ? "▼"
                    : "►"
                  : ""}{" "}
                {region.name}
              </div>
              {expandedRegions.includes(region.id) &&
                region.divisions &&
                region.divisions.map((division) => (
                  <div
                    key={division.id}
                    className="tree-sub-sub-item"
                    style={{ marginLeft: "30px" }}
                  >
                    <div
                      className="tree-sub-sub-item-header"
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
                          className="tree-sub-sub-sub-item"
                          style={{ marginLeft: "40px" }}
                        >
                          <div
                            className="tree-sub-sub-sub-item-header"
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
          ))}
      </div>
    );
  };

  if (!data) {
    return null;
  }

  return (
    <div className="left-column">
      <h3
        onClick={() => {
          const allMeters = data.flatMap((disco) =>
            disco.regions.flatMap((region) =>
              region.divisions.flatMap((division) =>
                division.subdivisions.flatMap((subdivision) => subdivision.meters)
              )
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


const Index = () => {
  const [metreModal, setMetreModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
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
          onAllClick={handleAllData}
          onDiscosClick={handleDiscosClick}
          onDivisionClick={handleDivisionClick}
          onItemClick={handleItemClick}
          onRegionClick={handleRegionClick}
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
          <div className="PlusIcon" onClick={() => setMetreModal((pre) => !pre)}>
            <FaPlus className="add-icon" />
          </div>
        </div>
        {metreModal && (
          <MeterModal data={data} isOpen={metreModal} setIsOpen={setMetreModal} />
        )}
        {displayTree ? (
          <>
            {/* Render search input and pagination in tree view mode */}
            <div style={{ display: "flex", alignItems: "center" }}>
  <div style={{ marginRight: "10px" , display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
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
  <div className="PlusIcon" onClick={() => setMetreModal((pre) => !pre)}>
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
                Page {currentPage} of {Math.ceil(selectedItem.length / itemsPerPage)}
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
          <div>
            {/* Render your table view here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
