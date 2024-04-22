  import React, { useState } from "react";
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

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const filteredItems = selectedItem ? selectedItem.filter(meter => {
      return (
        (telcoFilter ? meter.TELCO && meter.TELCO.includes(telcoFilter) : true) &&
        (meterTypeFilter ? meter.meter_type === meterTypeFilter : true) &&
        (statusFilter ? meter.status === statusFilter : true)
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
          <div className="meter-management-buttons" >
        
            <button className="button import-button" onClick={toggleImportModal} >Import Meters</button>
            <button className="button export-button"  onClick={handleExportMeters} >Export Meters</button>
          </div>
          {currentItems.length > 0 ? (
            <table className="meter-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Application No</th>
                  <th>Reference No</th>
                  <th>Meter Status</th>
                  <th>Green Meter</th>
                  <th>New Meter Number</th>
                  <th>Old Meter Number</th>
                  <th>New Meter Reading</th>
                  <th>Connection Type</th>
                  <th>San Load</th>
                  <th>Bill Month</th>
                  <th>Meter Type</th>
                  <th>Kwh MF</th>
                  <th>Telco</th>
                  <th>SIM No</th>
                  <th>Signal Strength</th>
                  <th>Consumer Name</th>
                  <th>Address</th>
                  <th>Picture Upload</th>
                  <th>Longitude</th>
                  <th>Latitude</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(meter => (
                  <tr key={meter.id}>
                    <td>{meter.id}</td>
                    <td>{meter.APPLICATION_NO}</td>
                    <td>{meter.reference_no}</td>
                    <td>{meter.status}</td>
                    <td>{meter.GREEN_METER}</td>
                    <td>{meter.NEW_METER_NUMBER}</td>
                    <td>{meter.old_meter_no}</td>
                    <td>{meter.NEW_METER_READING}</td>
                    <td>{meter.connection_type}</td>
                    <td>{meter.sanction_load}</td>
                    <td>{meter.bill_month}</td>
                    <td>{meter.meter_type}</td>
                    <td>{meter.kwh_mf}</td>
                    <td>{meter.TELCO}</td>
                    <td>{meter.SIM_NO}</td>
                    <td>{meter.SIGNAL_STRENGTH}</td>
                    <td>{meter["Consumer Name"]}</td>
                    <td>{meter.Address}</td>
                    <td>{meter.PICTURE_UPLOAD}</td>
                    <td>{meter.longitude}</td>
                    <td>{meter.latitude}</td>
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
          {/* List and table rendering as previously defined */}
        </div>
      </>
    );
  };

  export default RightColumn;
