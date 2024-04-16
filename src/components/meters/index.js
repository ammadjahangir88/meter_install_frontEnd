import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import axiosInstance from "../utils/Axios";
import MeterModal from "./meterModal/MeterModal";
import { FaPlus, FaSearch } from "react-icons/fa";
import RightColumn from "./RightColumn.js";
import TableView from "./TableView.js";
import LeftColumn from "./LeftColumn.js";
import Pagination from "./Pagination";





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
  const [highlightedItem, setHighlightedItem] = useState({ name: '', type: '' });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedItem.slice(indexOfFirstItem, indexOfLastItem);
  console.log(highlightedItem)
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 0.3, width: "100%", height: "100%" }}>
        <LeftColumn
          data={data}
          setSelectedItem={setSelectedItemId} // Make sure this is correct
          setHighlightedItem={setHighlightedItem}
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
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={selectedItem.length}
              onPageChange={handlePageChange}
            />
            
          </>
        ) : (
          <div>
              {/* <div>{highlightedItem.name} ({highlightedItem.type})</div>  */}
              <TableView data={data} item={highlightedItem} />
            
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
