import React, { useState, useEffect } from 'react';
import './Reports.css'
import axiosInstance from '../components/utils/Axios';

const Reports = () => {
  const [meters, setMeters] = useState([]);
  const [discos, setDiscos] = useState([]);
  const [regions, setRegions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(''); 
  const [subdivisions, setSubdivisions] = useState([]);
  const [selectedDisco, setSelectedDisco] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  console.log(users)
  useEffect(() => {
    axiosInstance.get('v1/all_discos').then(response => setDiscos(response.data));
    axiosInstance.get('v1/users').then(response => setUsers(response.data)); // Fetch users
    fetchMeters();
  }, []);
  const fetchMeters = (params = {}) => {
    axiosInstance.get('/v1/meters', { params })
      .then(response => {
        setMeters(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch meters:', error);
      });
  };

  const handleDiscoChange = (event) => {
    const newDiscoId = event.target.value;
    setSelectedDisco(newDiscoId);
    setRegions([]);
    setDivisions([]);
    setSubdivisions([]);
    setSelectedRegion('');
    setSelectedDivision('');
    setSelectedSubdivision('');

    if (newDiscoId) {
      axiosInstance.get(`/v1/regions`, { params: { disco_id: newDiscoId } }).then(response => {
        setRegions(response.data);
      });
    }
  };
  const handleExportReport = () => {
    if (!fromDate || !toDate) {
      alert('Both From Date and To Date need to be selected to export a report.');
      return;
    }
    const params = {
      user_id: selectedUser,
      disco_id: selectedDisco,
      region_id: selectedRegion,
      division_id: selectedDivision,
      subdivision_id: selectedSubdivision,
      from_date: fromDate,
      to_date: toDate
    };
  
    axiosInstance.post('/v1/meters/generate_report', params, { responseType: 'blob' })
      .then((response) => {
        // Create a URL from the response blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'meter_report.pdf'); // Set the filename for the download
        document.body.appendChild(link);
        link.click();
        link.remove(); // Clean up by removing the link
      })
      .catch(error => {
        console.error('Failed to generate report:', error);
      });
  };
  
  

  const handleRegionChange = (event) => {
    const newRegionId = event.target.value;
    setSelectedRegion(newRegionId);
    setDivisions([]);
    setSubdivisions([]);
    setSelectedDivision('');
    setSelectedSubdivision('');

    if (newRegionId) {
      axiosInstance.get(`/v1/divisions`, { params: { region_id: newRegionId } }).then(response => {
        setDivisions(response.data);
      });
    }
  };

  const handleDivisionChange = (event) => {
    const newDivisionId = event.target.value;
    setSelectedDivision(newDivisionId);
    setSubdivisions([]);
    setSelectedSubdivision('');

    if (newDivisionId) {
      axiosInstance.get(`/v1/subdivisions`, { params: { division_id: newDivisionId } }).then(response => {
        setSubdivisions(response.data);
      });
    }
  };

  const handleSubdivisionChange = (event) => {
    setSelectedSubdivision(event.target.value);
  };
  const handleExportMeters = () => {
    console.log("Exporting meters...");
    const meterIds = meters.map(item => item.id);
   

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

  useEffect(() => {
    // Build the parameters object based on selected values
    const params = {};
    if (selectedDisco) params.disco_id = selectedDisco;
    if (selectedRegion) params.region_id = selectedRegion;
    if (selectedDivision) params.division_id = selectedDivision;
    if (selectedSubdivision) params.subdivision_id = selectedSubdivision;
    if (selectedUser) params.user_id = selectedUser;
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
  
    // Only fetch meters if at least one of the filters is applied
    if (Object.keys(params).length !== 0) {
      axiosInstance.get('/v1/meters', { params })
        .then(response => {
          setMeters(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch meters:', error);
        });
    } else {
      // Optionally clear meters if no filters are set
      fetchMeters();
    }
  }, [selectedDisco, selectedRegion, selectedDivision,selectedUser, selectedSubdivision, fromDate, toDate]);
  
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    console.log('User selected:', event.target.value);
  };

  return (
    <div className="reports-meters-container">
  <div className="filters reports-filters">
  <select value={selectedUser} onChange={handleUserChange} className="reports-select">
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
    <select value={selectedDisco} onChange={handleDiscoChange} className="reports-select">
      <option value="">Select Disco</option>
      {discos.map(disco => (
        <option key={disco.id} value={disco.id}>{disco.name}</option>
      ))}
    </select>
    <select value={selectedRegion} onChange={handleRegionChange} disabled={!selectedDisco} className="reports-select">
      <option value="">Select Region</option>
      {regions.map(region => (
        <option key={region.id} value={region.id}>{region.name}</option>
      ))}
    </select>
    <select value={selectedDivision} onChange={handleDivisionChange} disabled={!selectedRegion} className="reports-select">
      <option value="">Select Division</option>
      {divisions.map(division => (
        <option key={division.id} value={division.id}>{division.name}</option>
      ))}
    </select>
    <select value={selectedSubdivision} onChange={handleSubdivisionChange} disabled={!selectedDivision} className="reports-select">
      <option value="">Select Subdivision</option>
      {subdivisions.map(subdivision => (
        <option key={subdivision.id} value={subdivision.id}>{subdivision.name}</option>
      ))}
    </select>
    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="reports-date-input" />
    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} disabled={!fromDate} min={fromDate} className="reports-date-input" />
  </div>
  <div className="meter-management-buttons">
         
          <button className="button export-button"  onClick={handleExportMeters} >Export Meters</button>
          <button className="button export-button" onClick={handleExportReport} disabled={!selectedUser}>Export Report</button>

        </div>
  <table className="reports-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>NEW_METER_NUMBER</th>
        <th>REF_NO</th>
        <th>METER_STATUS</th>
        <th>CONNECTION_TYPE</th>
        <th>BILL_MONTH</th>
        <th>CONSUMER_NAME</th>
      </tr>
    </thead>
    <tbody>
      {meters.map((meter, index) => (
        <tr key={index}>
          <td>{meter.id}</td>
          <td>{meter.NEW_METER_NUMBER}</td>
          <td>{meter.REF_NO}</td>
          <td>{meter.METER_STATUS}</td>
          <td>{meter.CONNECTION_TYPE}</td>
          <td>{meter.BILL_MONTH}</td>
          <td>{meter.CONSUMER_NAME}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default Reports;
