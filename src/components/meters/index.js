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
  const [displayTree, setDisplayTree] = useState(true); 
  const [loading, setLoading] = useState(false);  
  const [highlightedItem, setHighlightedItem] = useState({
    name: "",
    type: "all",
    id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/v1/discos");
        setDiscosData(response.data);
        const allMeters = response.data.flatMap(disco =>
          disco.regions.flatMap(region =>
            region.divisions.flatMap(division =>
              division.subdivisions.flatMap(subdivision => subdivision.meters)
            )
          )
        );
        setSelectedItem(allMeters);
        console.log("All Meters:", allMeters);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);  
    };

    fetchData();
  }, []);

  const handleRegionClick = (item) => {
   
    const regionMeters = item.divisions.flatMap((division) =>
      division.subdivisions.flatMap((subdivision) => subdivision.meters)
    );
    console.log(regionMeters);
    
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
   
    const discoMeters = disco.regions.flatMap((region) =>
      region.divisions.flatMap((division) =>
        division.subdivisions.flatMap((subdivision) => subdivision.meters)
      )
    );
    setSelectedItem(discoMeters);
  };

 
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

    
      setSelectedItem(allMeters);

      console.log("All Meters:", allMeters); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();

 }
  console.log(highlightedItem);
  if (loading) {
    return <div className="Loader">Loading...</div>;  
  }
  return (
    <div style={{ display: "flex", height: "auto", minHeight:'100vh' }}>
      <div style={{ flex: 0.3, width: "100%"  }}>
        <LeftColumn
          data={data}
          setSelectedItem={setSelectedItemId}
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
          <RightColumn selectedItem={selectedItem} item={highlightedItem}  updateData={updateData} />
        ) : displayTree ? (
          <RightColumn selectedItem={selectedItem} item={highlightedItem}  updateData={updateData} />
        ) : (
          <TableView data={data} item={highlightedItem} updateData={updateData} />
        )}
      </div>
    </div>
  );
};

export default Index;
