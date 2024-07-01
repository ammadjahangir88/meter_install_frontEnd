import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/Axios';
import { useParams } from 'react-router-dom';
import './MetersStatInSubDivision.css';

const MetersStatInSubDivision = () => {
  const { subdivisionId } = useParams(); // Get the Subdivision ID from the URL
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [subdivisionId]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/v1/subdivisions/${subdivisionId}`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="meters-stat-subdivision">
      <h1>Meters in {data  && data.name}</h1>
      <div className="statistics">
        <div className="stat-item">
          <h2>Total Meters in Subdivision</h2>
          <p>{data && data.total_meters}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters Installed</h2>
          <p>{data && data.meters_installed}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters QC Done</h2>
          <p>{data && data.meters_qc_done}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters QC OK</h2>
          <p>{data && data.meters_qc_ok}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters QC Remaining</h2>
          <p>{data && data.meters_qc_remaining}</p>
        </div>
        <div className="stat-item">
          <h2>Meters to be Installed</h2>
          <p>{data && data.meters_to_be_installed}</p>
        </div>
      </div>
    </div>
  );
}

export default MetersStatInSubDivision;
