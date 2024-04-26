import React, { useState, useEffect } from "react";

import "./index.css";
import axiosInstance from "../utils/Axios";
import MeterModal from "./meterModal/MeterModal";

import RightColumn from "./RightColumn.js";
import TableView from "./TableView.js";
import LeftColumn from "./LeftColumn.js";

const Index = () => {
  const [metreModal, setMetreModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [data, setDiscosData] = useState([]);
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

  const [highlightedItem, setHighlightedItem] = useState({
    name: "",
    type: "",
    id: ''
  });
 function updateData(){
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

 }
  console.log(highlightedItem);
  return (
    <div style={{ display: "flex", height: "auto", minHeight:'100vh' }}>
      <div style={{ flex: 0.3, width: "100%"  }}>
        <LeftColumn
          data={data}
          setSelectedItem={setSelectedItemId} // Make sure this is correct
          setHighlightedItem={setHighlightedItem}
          selectedItemId={selectedItemId}
          onDiscosClick={handleDiscosClick}
          onDivisionClick={handleDivisionClick}
          onRegionClick={handleRegionClick}
          onItemClick={handleItemClick}
          onAllClick={handleAllData}
        />
      </div>
      <div style={{ flex: 1.7, width: "70%"  }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {highlightedItem.type !== "subdivision" && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {displayTree ? (
                <button
                  onClick={() => setDisplayTree(false)}
                  className="viewToggleBtn"
                  aria-label="Switch to Table View"
                >
                  Table View
                </button>
              ) : (
                <button
                  onClick={() => setDisplayTree(true)}
                  className="viewToggleBtn"
                  aria-label="Switch to Tree View"
                >
                  Tree View
                </button>
              )}
            </div>
          )}
        </div>
        {metreModal && (
          <MeterModal
            data={data}
            isOpen={metreModal}
            setIsOpen={setMetreModal}
          />
        )}
        {highlightedItem.type === "subdivision" ? (
          <RightColumn selectedItem={selectedItem} />
        ) : displayTree ? (
          <RightColumn selectedItem={selectedItem} item={highlightedItem} />
        ) : (
          <TableView data={data} item={highlightedItem} updateData={updateData} />
        )}
      </div>
    </div>
  );
};

export default Index;
