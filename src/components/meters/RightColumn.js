import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Pagination from "./Pagination";
import MeterModal from "./meterModal/MeterModal";
import "./index.css";
import axiosInstance from "../utils/Axios";
import "./RightColumn.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditMeter from "./EditMeter";

const RightColumn = ({ selectedItem, updateData, item, currentUserRole }) => {
  console.log(item.type);
  const [search, setSearch] = useState({ meterNo: "", refNo: "" });
  const [connectionTypeFilter, setConnectionTypeFilter] = useState("");
  const [telcoFilter, setTelcoFilter] = useState("");
  const [meterTypeFilter, setMeterTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [metreModal, setMetreModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  // Assuming 'currentUserRole' is passed as a prop or from context/global state
  const canEdit = currentUserRole === "Field Supervisor" || currentUserRole === "Admin";
  const canImport = currentUserRole === "Admin";

  console.log(currentUserRole);
  const [file, setFile] = useState(null);
  //  console.log(currentUserRole)
  useEffect(() => {
    // Reset filters when the selected item changes
    setTelcoFilter("");
    setMeterTypeFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  }, [selectedItem]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredItems = selectedItem
    ? selectedItem.filter((meter) => {
        return (
          (telcoFilter
            ? meter.TELCO && meter.TELCO.includes(telcoFilter)
            : true) &&
          (connectionTypeFilter
            ? meter.CONNECTION_TYPE === connectionTypeFilter
            : true) &&
          (statusFilter ? meter.METER_STATUS === statusFilter : true) &&
          (search.meterNo
            ? meter.NEW_METER_NUMBER.includes(search.meterNo)
            : true) &&
          (search.refNo ? meter.REF_NO.includes(search.refNo) : true)
        );
      })
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    accept: "text/csv",
  });

  const handleImportMeters = () => {
    if (!file) {
      alert("Please select a CSV file to import!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    axiosInstance
      .post("/v1/meters/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        updateData();
        alert("Meters imported successfully!");

        setImportModal(false); // Close the modal
        setFile(null); // Reset file
      })
      .catch((error) => {
        console.error("Import failed:", error);
        alert("Failed to import meters: " + error.message);
      });
  };

  const toggleImportModal = () => {
    setFile(null); // Reset file on opening/closing modal
    setImportModal(!importModal);
  };

  const handleExportMeters = () => {
    console.log("Exporting meters...");
    const meterIds = filteredItems.map((item) => item.id);
    console.log("Filtered Items:", filteredItems); // Log to confirm items

    axiosInstance({
      url: "/v1/meters/export",
      method: "POST",
      responseType: "blob",
      data: { meter_ids: meterIds },
    })
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "exported_meters.csv"); // Set file name
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove(); // Clean up after download
      })
      .catch((error) => {
        console.error("Error exporting meters:", error);
      });
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
      setSelectedMeters(currentItems.map((item) => item.id));
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
      const response = await axiosInstance.delete("/v1/meters/bulk_delete", {
        data: { meter_ids: selectedMeters }, // Make sure to send meter IDs
      });
      alert("Selected meters deleted successfully!");
      setSelectedMeters([]); // Clear selections
      updateData();

      // Optionally, fetch the updated list or modify state to remove deleted items
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
        />
      )}
      {metreModal && (
        <MeterModal isOpen={metreModal} setIsOpen={setMetreModal} />
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
          <button className="addMetre" onClick={() => setMetreModal(true)}>
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
        <div className="filters">
          <input
            type="text"
            placeholder="Search by Meter No."
            value={search.meterNo}
            onChange={(e) => setSearch({ ...search, meterNo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by Ref. No."
            value={search.refNo}
            onChange={(e) => setSearch({ ...search, refNo: e.target.value })}
          />
          <select
            value={connectionTypeFilter}
            onChange={(e) => setConnectionTypeFilter(e.target.value)}
          >
            <option value="">All Connection Types</option>
            <option value="Industrial">Industrial</option>
            <option value="Street">Street</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>
          <select
            value={telcoFilter}
            onChange={(e) => setTelcoFilter(e.target.value)}
          >
            <option value="">All Telcos</option>
            <option value="Jazz">Jazz</option>
            <option value="Warid">Warid</option>
            <option value="Zong">Zong</option>
            <option value="Ufone">Ufone</option>
            <option value="Telenor">Telenor</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="meter-management-buttons">
          {item.type === "subdivision" && (
            <button
              className="button import-button"
              onClick={toggleImportModal}
            >
              Import Meters
            </button>
          )}
          <button className="button export-button" onClick={handleExportMeters}>
            Export Meters
          </button>
        </div>
        {currentItems.length > 0 ? (
          <table className="meter-table">
            <thead>
              <tr>
                <th>ID</th>
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
              {currentItems.map((meter) => (
                <tr key={meter.id}>
                  <td>{meter.id}</td>
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
                      <a href={meter.PICTURE_UPLOAD} target="_blank">
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
                        <FaEdit
                          className="edit-icon"
                          onClick={() => handleEdit(meter)}
                        />
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
        ) : (
          <p>No meters found based on filters.</p>
        )}

        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default RightColumn;
