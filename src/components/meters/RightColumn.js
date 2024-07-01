import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Pagination from "./Pagination";
import MeterModal from "./meterModal/MeterModal";
import axiosInstance from "../utils/Axios";
import "./RightColumn.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditMeter from "./EditMeter";

const RightColumn = ({ selectedItem, updateData, item, currentUserRole, loading, fetchMeters, highlightedItem, pagination, setPagination }) => {
  const [search, setSearch] = useState({ meterNo: "", refNo: "" });
  const [connectionTypeFilter, setConnectionTypeFilter] = useState("");
  const [telcoFilter, setTelcoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [meterModal, setMeterModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [file, setFile] = useState(null);

  const canEdit = currentUserRole === "Field Supervisor" || currentUserRole === "Admin";
  const canImport = currentUserRole === "Admin";
  const [applyFilter, setApplyFilter] = useState(false);

  useEffect(() => {
    if (!applyFilter) {
      resetFilters();
    } else {
      setApplyFilter(false);
    }
  }, [selectedItem]);

  const resetFilters = () => {
    setSearch({ meterNo: "", refNo: "" });
    setConnectionTypeFilter("");
    setTelcoFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setApplyFilter(true);
    setCurrentPage(pageNumber);
    fetchMeters(highlightedItem.id, highlightedItem.type, pageNumber, itemsPerPage, getFilters());
  };

  const getFilters = () => ({
    meter_no: search.meterNo,
    ref_no: search.refNo,
    connection_type: connectionTypeFilter,
    telco: telcoFilter,
    status: statusFilter,
  });

  const applyFilters = () => {
    setApplyFilter(true);
    setCurrentPage(1);
    fetchMeters(highlightedItem.id, highlightedItem.type, 1, itemsPerPage, getFilters());
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
    accept: "text/csv",
  });

  const handleImportMeters = () => {
    if (!file) {
      alert("Please select a CSV file to import!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("meter[subdivision_id]", item.id);

    axiosInstance.post("/v1/meters/import", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(response => {
        if (response.data.errors && response.data.errors.length > 0) {
          const errorMessages = response.data.errors.map(err => `${err.ref_no}: ${err.error}`).join("\n");
          alert(`Import completed with errors:\n${errorMessages}`);
        } else {
          alert("All meters imported successfully!");
        }
        updateData(item.id, item.type);
        setImportModal(false);
        setFile(null);
      })
      .catch(error => {
        console.error("Import failed:", error);
        alert("Failed to import meters. Please check the console for more details.");
      });
  };

  const toggleImportModal = () => {
    setFile(null);
    setImportModal(!importModal);
  };

  const handleExportMeters = () => {
    const filters = getFilters();
  
    // Add the highlighted item parameters
    const exportParams = {
      filters: filters,
      [`${highlightedItem.type}_id`]: highlightedItem.id,
    };
  
    axiosInstance.post(
      "/v1/meters/export",
      exportParams,
      { responseType: "blob" }
    )
    .then(response => {
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "exported_meters.csv");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    })
    .catch(error => console.error("Error exporting meters:", error));
  };

  const handleMeterSelection = (id) => {
    setSelectedMeters((prev) =>
      prev.includes(id)
        ? prev.filter((meterId) => meterId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMeters(selectedItem.map((item) => item.id));
    } else {
      setSelectedMeters([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMeters.length === 0) {
      alert("No meters selected for deletion.");
      return;
    }

    try {
      await axiosInstance.delete("/v1/meters/bulk_delete", { data: { meter_ids: selectedMeters } });
      alert("Selected meters deleted successfully!");
      setSelectedMeters([]);
      updateData(item.id, item.type);
    } catch (error) {
      console.error("Failed to delete meters:", error);
      alert("Failed to delete selected meters: " + error.response.data.error);
    }
  };

  const handleEdit = (meter) => {
    setSelectedMeter(meter);
    setEditModalOpen(true);
  };

  return (
    <>
      {canEdit && (
        <EditMeter
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
          meterId={selectedMeter ? selectedMeter.id : null}
          updateData={updateData}
        />
      )}
      {meterModal && (
        <MeterModal isOpen={meterModal} setIsOpen={setMeterModal} updateData={updateData} item={item} />
      )}
      {importModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleImportModal}>
              &times;
            </span>
            <h3 className="modal-title">Import Meters</h3>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop a CSV file here, or click to select a file</p>
            </div>
            <button className="import-button" onClick={handleImportMeters}>
              Import Meters
            </button>
          </div>
        </div>
      )}
      <div className="right-column-container">
        {item.type === "subdivision" && canEdit && (
          <button className="add-meter-button" onClick={() => setMeterModal(true)}>
            Add Meter
          </button>
        )}
        {canEdit && (
          <button
            className="delete-meters-button"
            onClick={handleDeleteSelected}
            disabled={selectedMeters.length === 0}
          >
            Delete Selected Meters
          </button>
        )}
        {loading ? (
          <div className="Loader">Loading meters...</div>
        ) : (
          <>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by Meter No."
                value={search.meterNo}
                onChange={(e) => setSearch({ ...search, meterNo: e.target.value })}
                className="search-input"
              />
              <input
                type="text"
                placeholder="Search by Ref. No."
                value={search.refNo}
                onChange={(e) => setSearch({ ...search, refNo: e.target.value })}
                className="search-input"
              />
              <select
                value={connectionTypeFilter}
                onChange={(e) => setConnectionTypeFilter(e.target.value)}
                className="select-input"
              >
                <option value="">All Connection Types</option>
                <option value="Domestic">Domestic</option>
                <option value="General_Services">General Services</option>
                <option value="Agricultral">Agricultral</option>
                <option value="Industrial">Industrial</option>
                <option value="Street_Light">Street Light</option>
                <option value="Bulk">Commercial</option>
                <option value="Residential">Residential</option>
              </select>
              <select
                value={telcoFilter}
                onChange={(e) => setTelcoFilter(e.target.value)}
                className="select-input"
              >
                <option value="">All Telcos</option>
                <option value="Jazz">Jazz</option>
                <option value="Zong">Zong</option>
                <option value="Ufone">Ufone</option>
                <option value="Telenor">Telenor</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select-input"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button onClick={applyFilters} className="apply-filters-button">
                Apply Filters
              </button>
            </div>
            <div className="meter-management-buttons">
              {item.type === "subdivision" && (
                <button className="import-button" onClick={toggleImportModal}>
                  Import Meters
                </button>
              )}
              <button className="export-button" onClick={handleExportMeters}>
                Export Meters
              </button>
            </div>
            {selectedItem.length > 0 ? (
              <div className="table-container">
                <table className="meter-table">
                  <thead>
                    <tr>
                      <th>Serial_No</th>
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
                      {canEdit && <th>Edit</th>}
                      {canEdit && <th>Delete</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.map((meter, index) => (
                      <tr key={meter.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Serial Number */}
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
                            <a href={meter.PICTURE_UPLOAD} target="_blank" rel="noopener noreferrer">
                              View Image
                            </a>
                          )}
                        </td>
                        <td>
                          {meter.PREVIOUS_METER_PICTURE && (
                            <a href={meter.PREVIOUS_METER_PICTURE} target="_blank" rel="noopener noreferrer">
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
                        {canEdit && (
                          <>
                            <td>
                              <FaEdit className="edit-icon" onClick={() => handleEdit(meter)} />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedMeters.includes(meter.id)}
                                onChange={() => handleMeterSelection(meter.id)}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No meters found based on filters.</p>
            )}
            <Pagination
              currentPage={pagination.currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={selectedItem.length}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default RightColumn;
