import React, { useState, useEffect } from "react";
import "./Reports.css";
import axiosInstance from "../components/utils/Axios";
import Pagination from "../components/meters/Pagination";

const Reports = () => {
  const [meters, setMeters] = useState([]);
  const [discos, setDiscos] = useState([]);
  const [regions, setRegions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [subdivisions, setSubdivisions] = useState([]);
  const [selectedDisco, setSelectedDisco] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubdivision, setSelectedSubdivision] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage=15
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axiosInstance
      .get("v1/all_discos")
      .then((response) => setDiscos(response.data));
    axiosInstance.get("v1/users").then((response) => setUsers(response.data));
    fetchMeters();
  }, []);

  const fetchMeters = (params = {}) => {
    axiosInstance
      .get("/v1/meters", { params })
      .then((response) => {
        setMeters(response.data.meters);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error("Failed to fetch meters:", error);
        setMeters([]);
      });
  };

  const handleDiscoChange = (event) => {
    const newDiscoId = event.target.value;
    setSelectedDisco(newDiscoId);
    setRegions([]);
    setDivisions([]);
    setSubdivisions([]);
    setSelectedRegion("");
    setSelectedDivision("");
    setSelectedSubdivision("");
    setCurrentPage(1);
    if (newDiscoId) {
      axiosInstance
        .get(`/v1/regions`, { params: { disco_id: newDiscoId } })
        .then((response) => {
          setRegions(response.data);
        });
    }
  };

  const handleExportReport = () => {
    if (!fromDate || !toDate) {
      alert(
        "Both From Date and To Date need to be selected to export a report."
      );
      return;
    }
    const params = {
      user_id: selectedUser,
      disco_id: selectedDisco,
      region_id: selectedRegion,
      division_id: selectedDivision,
      subdivision_id: selectedSubdivision,
      from_date: fromDate,
      to_date: toDate,
    };

    axiosInstance
      .post("/v1/meters/generate_report", params, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "meter_report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Failed to generate report:", error);
      });
  };

  const handleRegionChange = (event) => {
    const newRegionId = event.target.value;
    setSelectedRegion(newRegionId);
    setDivisions([]);
    setSubdivisions([]);
    setSelectedDivision("");
    setSelectedSubdivision("");
    setCurrentPage(1);
    if (newRegionId) {
      axiosInstance
        .get(`/v1/divisions`, { params: { region_id: newRegionId } })
        .then((response) => {
          setDivisions(response.data);
        });
    }
  };

  const handleDivisionChange = (event) => {
    const newDivisionId = event.target.value;
    setSelectedDivision(newDivisionId);
    setSubdivisions([]);
    setSelectedSubdivision("");
    setCurrentPage(1);
    if (newDivisionId) {
      axiosInstance
        .get(`/v1/subdivisions`, { params: { division_id: newDivisionId } })
        .then((response) => {
          setSubdivisions(response.data);
        });
    }
  };

  const handleSubdivisionChange = (event) => {
    setCurrentPage(1);
    setSelectedSubdivision(event.target.value);
  };

  const handleExportMeters = () => {
    const params = {
      disco_id: selectedDisco,
      region_id: selectedRegion,
      division_id: selectedDivision,
      subdivision_id: selectedSubdivision,
      from_date: fromDate,
      to_date: toDate,
    };
  
    axiosInstance({
      url: "/v1/meters/export1",
      method: "POST",
      responseType: "blob",
      data: params,
    })
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "exported_meters.csv");
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
      })
      .catch((error) => {
        console.error("Error exporting meters:", error);
      });
  };
  useEffect(() => {
    const params = {
      page: currentPage,
      per_page: 15,
    };
    if (selectedDisco) params.disco_id = selectedDisco;
    if (selectedRegion) params.region_id = selectedRegion;
    if (selectedDivision) params.division_id = selectedDivision;
    if (selectedSubdivision) params.subdivision_id = selectedSubdivision;
    if (selectedUser) params.user_id = selectedUser;
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;

    fetchMeters(params);
  }, [
    selectedDisco,
    selectedRegion,
    selectedDivision,
    selectedSubdivision,
    selectedUser,
    fromDate,
    toDate,
    currentPage,
  ]);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="reports-meters-container">
      <div className="filters reports-filters">
        <select
          value={selectedUser}
          onChange={handleUserChange}
          className="reports-select"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <select
          value={selectedDisco}
          onChange={handleDiscoChange}
          className="reports-select"
        >
          <option value="">Select Disco</option>
          {discos.map((disco) => (
            <option key={disco.id} value={disco.id}>
              {disco.name}
            </option>
          ))}
        </select>
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          disabled={!selectedDisco}
          className="reports-select"
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <select
          value={selectedDivision}
          onChange={handleDivisionChange}
          disabled={!selectedRegion}
          className="reports-select"
        >
          <option value="">Select Division</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {division.name}
            </option>
          ))}
        </select>
        <select
          value={selectedSubdivision}
          onChange={handleSubdivisionChange}
          disabled={!selectedDivision}
          className="reports-select"
        >
          <option value="">Select Subdivision</option>
          {subdivisions.map((subdivision) => (
            <option key={subdivision.id} value={subdivision.id}>
              {subdivision.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="reports-date-input"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          disabled={!fromDate}
          min={fromDate}
          className="reports-date-input"
        />
      </div>
      <div className="meter-management-buttons">
        <button className="button export-button" onClick={handleExportMeters}>
          Export Meters
        </button>
        <button
          className="button export-button"
          onClick={handleExportReport}
          disabled={!selectedUser}
        >
          Export Report
        </button>
      </div>
      <div className="table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>NEW_METER_NUMBER</th>
              <th>REF_NO</th>
              <th>METER_STATUS</th>
              <th>OLD_METER_NUMBER</th>
              <th>OLD_METER_READING</th>
              <th>NEW_METER_READING</th>
              <th>CONNECTION_TYPE</th>
              <th>BILL_MONTH</th>
              <th>LONGITUDE</th>
              <th>LATITUDE</th>
              <th>METER_TYPE</th>
              <th>KWH_MF</th>
              <th>SAN_LOAD</th>
              <th>CONSUMER_NAME</th>
              <th>CONSUMER_ADDRESS</th>
              <th>QC_CHECK</th>
              <th>APPLICATION_NO</th>
              <th>GREEN_METER</th>
              <th>TELCO</th>
              <th>SIM_NO</th>
              <th>SIGNAL_STRENGTH</th>
              <th>PICTURE_UPLOAD</th>
              <th>PREVIOUS_METER_PICTURE</th>
              <th>METR_REPLACE_DATE_TIME</th>
              <th>NO_OF_RESET_OLD_METER</th>
              <th>NO_OF_RESET_NEW_METER</th>
              <th>KWH_T1</th>
              <th>KWH_T2</th>
              <th>KWH_TOTAL</th>
              <th>KVARH_T1</th>
              <th>KVARH_T2</th>
              <th>KVARH_TOTAL</th>
              <th>MDI_T1</th>
              <th>MDI_T2</th>
              <th>MDI_TOTAL</th>
              <th>CUMULATIVE_MDI_T1</th>
              <th>CUMULATIVE_MDI_T2</th>
              <th>CUMULATIVE_MDI_Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(meters)
              ? meters.map((meter, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>{" "}
                    {/* Serial Number */}
                    <td>{meter.NEW_METER_NUMBER}</td>
                    <td>{meter.REF_NO}</td>
                    <td>{meter.METER_STATUS}</td>
                    <td>{meter.OLD_METER_NUMBER}</td>
                    <td>{meter.OLD_METER_READING}</td>
                    <td>{meter.NEW_METER_READING}</td>
                    <td>{meter.CONNECTION_TYPE}</td>
                    <td>{meter.BILL_MONTH}</td>
                    <td>{meter.LONGITUDE}</td>
                    <td>{meter.LATITUDE}</td>
                    <td>{meter.METER_TYPE}</td>
                    <td>{meter.KWH_MF}</td>
                    <td>{meter.SAN_LOAD}</td>
                    <td>{meter.CONSUMER_NAME}</td>
                    <td>{meter.CONSUMER_ADDRESS}</td>
                    <td>{meter.QC_CHECK ? "Yes" : "No"}</td>
                    <td>{meter.APPLICATION_NO}</td>
                    <td>{meter.GREEN_METER}</td>
                    <td>{meter.TELCO}</td>
                    <td>{meter.SIM_NO}</td>
                    <td>{meter.SIGNAL_STRENGTH}</td>
                    <td>
                      {meter.PICTURE_UPLOAD && (
                        <a
                          href={meter.PICTURE_UPLOAD}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Image
                        </a>
                      )}
                    </td>
                    <td>
                      {meter.PREVIOUS_METER_PICTURE && (
                        <a
                          href={meter.PREVIOUS_METER_PICTURE}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Image
                        </a>
                      )}
                    </td>
                    <td>{meter.METR_REPLACE_DATE_TIME}</td>
                    <td>{meter.NO_OF_RESET_OLD_METER}</td>
                    <td>{meter.NO_OF_RESET_NEW_METER}</td>
                    <td>{meter.KWH_T1}</td>
                    <td>{meter.KWH_T2}</td>
                    <td>{meter.KWH_TOTAL}</td>
                    <td>{meter.KVARH_T1}</td>
                    <td>{meter.KVARH_T2}</td>
                    <td>{meter.KVARH_TOTAL}</td>
                    <td>{meter.MDI_T1}</td>
                    <td>{meter.MDI_T2}</td>
                    <td>{meter.MDI_TOTAL}</td>
                    <td>{meter.CUMULATIVE_MDI_T1}</td>
                    <td>{meter.CUMULATIVE_MDI_T2}</td>
                    <td>{meter.CUMULATIVE_MDI_Total}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Reports;
