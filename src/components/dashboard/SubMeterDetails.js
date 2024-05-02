import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/Axios";
import Pagination from "../meters/Pagination"; // Ensure correct import path
import "./MeterDetails.css";

function SubMeterDetails() {
  const { subdivisionId } = useParams();
  const [meters, setMeters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Set how many items you want per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/v1/meters/by_subdivision/${subdivisionId}`);
        setMeters(response.data);
      } catch (error) {
        console.error('Error fetching meters:', error);
      }
    };
    fetchData();
  }, [subdivisionId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = meters.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-view-container">
      <h1>Meters in Subdivision {subdivisionId}</h1>
      <table className="table-view">
        <thead>
          <tr>
            <th>ID</th>
            <th>New Meter Number</th>
            <th>Reference No</th>
            <th>Status</th>
            <th>Connection Type</th>
            <th>Consumer Name</th>
            <th>Location</th>
            <th>Reading</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(meter => (
            <tr key={meter.id}>
              <td>{meter.id}</td>
              <td>{meter.NEW_METER_NUMBER}</td>
              <td>{meter.REF_NO}</td>
              <td>{meter.METER_STATUS}</td>
              <td>{meter.CONNECTION_TYPE}</td>
              <td>{meter.CONSUMER_NAME}</td>
              <td>{`${meter.LONGITUDE}, ${meter.LATITUDE}`}</td>
              <td>{meter.NEW_METER_READING}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={meters.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default SubMeterDetails;
