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
    const [rightColumnLoading, setRightColumnLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [expandedItems, setExpandedItems] = useState([]);
    const [expandedRegions, setExpandedRegions] = useState([]);
    const [expandedDivisions, setExpandedDivisions] = useState([]);
    
    const [highlightedItem, setHighlightedItem] = useState({
      name: "",
      type: "all",
      id: "",
    });
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    // Fetch current user only once
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const response = await axiosInstance.get("/v1/users/current");
          setCurrentUser(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      };
      fetchCurrentUser();
    }, []);

    // Fetch discos data only once
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/v1/discos");
          const response1 = await axiosInstance.get(`/v1/discos/meters_list`)
          setDiscosData(response.data);
       
          setSelectedItem(response1.data.meters);
          setPagination(prevState => ({
            ...prevState,
            totalPages: response1.data.total_pages
          }));
          console.log("Response .data is",response1.data.meters)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      };

      fetchData();
    }, []);


    const fetchDiscos = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/v1/discos");
        setDiscosData(response.data);
    
        // Maintain the previously highlighted item
        if (highlightedItem.type === 'disco') {
          handleDiscosClick({ id: highlightedItem.id, name: highlightedItem.name });
        } else if (highlightedItem.type === 'region') {
          handleRegionClick({ id: highlightedItem.id, name: highlightedItem.name });
        } else if (highlightedItem.type === 'division') {
          handleDivisionClick({ id: highlightedItem.id, name: highlightedItem.name });
        } else if (highlightedItem.type === 'subdivision') {
          handleItemClick({ id: highlightedItem.id, name: highlightedItem.name });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    const fetchMeters = async (id, type, page = 1, perPage = 15, filters = {}) => {
      setRightColumnLoading(true);
      try {
        const response = await axiosInstance.get(`/v1/discos/meters_list`, {
          params: { [`${type}_id`]: id, page, per_page: perPage, ...filters },
        });
        setSelectedItem(response.data.meters);
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.total_pages,
        });
      } catch (error) {
        console.error("Error fetching meters:", error);
      }
      setRightColumnLoading(false);
    };
    
    
    // Add state for pagination
  

    const handleRegionClick = (region) => {
      setHighlightedItem({ name: region.name, type: "region", id: region.id });
      fetchMeters(region.id, "region");
    };

    const handleDivisionClick = (division) => {
      setHighlightedItem({ name: division.name, type: "division", id: division.id });
      fetchMeters(division.id, "division");
    };

    const handleItemClick = (subdivision) => {
      setHighlightedItem({ name: subdivision.name, type: "subdivision", id: subdivision.id });
      fetchMeters(subdivision.id, "subdivision");
    };

    const handleDiscosClick = (disco) => {
      setHighlightedItem({ name: disco.name, type: "disco", id: disco.id });
      fetchMeters(disco.id, "disco");
    };

    const handleAllData = async () => {
      setHighlightedItem({ name: "All", type: "all", id: "" });
    
      
      try {
        const response1 = await axiosInstance.get(`/v1/discos/meters_list`);
        setSelectedItem(response1.data.meters);
      } catch (error) {
        console.error("Error fetching meters list:", error);
        // Handle the error appropriately here
      }
    };
    

    console.log(highlightedItem);
    if (loading) {
      return <div className="Loader">Loading...</div>;
    }
    return (
      <div style={{ display: "flex", height: "auto", minHeight: "100vh" }}>
        <div style={{ flex: 0.3, width: "100%" }}>
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
          expandedItems={expandedItems} // Add this line
          setExpandedItems={setExpandedItems} // Add this line
          expandedRegions={expandedRegions} // Add this line
          setExpandedRegions={setExpandedRegions} // Add this line
          expandedDivisions={expandedDivisions} // Add this line
          setExpandedDivisions={setExpandedDivisions} // Add this line
        />
        </div>
        <div style={{ flex: 1.7, width: "70%" }}>
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
        {
          // Check if currentUser is not null before rendering RightColumn or TableView
          currentUser && highlightedItem.type === "subdivision" ? (
            <RightColumn
            selectedItem={selectedItem}
            item={highlightedItem}
            updateData={fetchMeters}
            currentUserRole={currentUser.role}
            loading={rightColumnLoading}
            fetchMeters={fetchMeters}  // Add this line
            highlightedItem={highlightedItem}  
            pagination={pagination}  // Add this line
            setPagination={setPagination}  // Add this line// Add this line
          />
          ) : currentUser && displayTree ? (
            <RightColumn
          selectedItem={selectedItem}
          item={highlightedItem}
          updateData={fetchMeters}
          currentUserRole={currentUser.role}
          loading={rightColumnLoading}
          fetchMeters={fetchMeters}  // Add this line
          highlightedItem={highlightedItem}  
          pagination={pagination}  // Add this line
          setPagination={setPagination}  // Add this line// Add this line
        />
          ) : currentUser ? (
            <TableView
              data={data}
              item={highlightedItem}
              updateData={fetchDiscos}
              currentUserRole={currentUser.role}

            />
          ) : (
            <div>Loading user data...</div> // Placeholder for loading state
          )
        }
        </div>
      </div>
    );
  };

  export default Index;
