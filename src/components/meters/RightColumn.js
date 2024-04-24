import React, { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import Pagination from "./Pagination";
import MeterModal from './meterModal/MeterModal';
import "./index.css";
import axiosInstance from "../utils/Axios";
import './RightColumn.css'

const RightColumn = ({ selectedItem }) => {
  const [telcoFilter, setTelcoFilter] = useState('');
  const [meterTypeFilter, setMeterTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [metreModal, setMetreModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Reset filters when the selected item changes
    setTelcoFilter("");
    setMeterTypeFilter("");
    setStatusFilter("");
  }, [selectedItem]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredItems = selectedItem ? selectedItem.filter(meter => {
    return (
      (telcoFilter ? meter.TELCO && meter.TELCO.includes(telcoFilter) : true) &&
      (meterTypeFilter ? meter.METER_TYPE === meterTypeFilter : true) &&
      (statusFilter ? meter.METER_STATUS === statusFilter : true)
    );
  }) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    },
    accept: 'text/csv'
  });


  const handleImportMeters = () => {
    if (!file) {
      alert('Please select a CSV file to import!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    axiosInstance.post('/v1/meters/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('Meters imported successfully!');
      setImportModal(false);  // Close the modal
      setFile(null);  // Reset file
    })
    .catch(error => {
      console.error('Import failed:', error);
      alert('Failed to import meters: ' + error.message);
    });
  };

  const toggleImportModal = () => {
    setFile(null); // Reset file on opening/closing modal
    setImportModal(!importModal);
  };


  const handleExportMeters = () => {
    console.log("Exporting meters...");
    const meterIds = filteredItems.map(item => item.id);
    console.log("Filtered Items:", filteredItems); // Log to confirm items

    axiosInstance({
      url: '/v1/meters/export',
      method: 'POST',
      responseType: 'blob', 
      data: { meter_ids: meterIds }
    })
    .then((response) => {
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'exported_meters.csv'); // Set file name
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove(); // Clean up after download
    })
    .catch((error) => {
      console.error('Error exporting meters:', error);
    });
  };

  return (
    <>
      {metreModal && (
        <MeterModal isOpen={metreModal} setIsOpen={setMetreModal} />
      )}
      {importModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleImportModal}>&times;</span>
            <h3 className="modal-title">Import Meters</h3>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop a CSV file here, or click to select a file</p>
            </div>
            <button className="import-button" onClick={handleImportMeters}>Import Meters</button>
          </div>
        </div>
      )}
      <div className="right-column-container">
        <button className="addMetre" onClick={() => setMetreModal(true)}>Add Meter</button>

        <div className="filters">
          <input
            type="text"
            placeholder="Filter by TELCO"
            value={telcoFilter}
            onChange={e => setTelcoFilter(e.target.value)}
          />
          <select value={meterTypeFilter} onChange={e => setMeterTypeFilter(e.target.value)}>
            <option value="">All Meter Types</option>
            <option value="Digital">Digital</option>
            <option value="Analog">Analog</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="meter-management-buttons">
          <button className="button import-button" onClick={toggleImportModal} >Import Meters</button>
          <button className="button export-button"  onClick={handleExportMeters} >Export Meters</button>
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
              </tr>
            </thead>
            <tbody>
              {currentItems.map(meter => (
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
                  <td>{meter.QC_CHECK ? 'Yes' : 'No'}</td>
                  <td>{meter.APPLICATION_NO}</td>
                  <td>{meter.GREEN_METER}</td>
                  <td>{meter.TELCO}</td>
                  <td>{meter.SIM_NO}</td>
                  <td>{meter.SIGNAL_STRENGTH}</td>
                  <td>{meter.PICTURE_UPLOAD}</td>
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
