import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import axiosInstance from '../utils/Axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewDivisions.css';

const colors = [
  "#8E44AD", "#2980B9", "#27AE60", "#16A085", "#F39C12",
  "#D35400", "#C0392B", "#BDC3C7", "#7F8C8D", "#34495E",
  "#2C3E50", "#1ABC9C", "#3498DB", "#9B59B6", "#E67E22",
  "#E74C3C", "#95A5A6", "#ECF0F1", "#F1C40F", "#E84393"
];

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

const ViewDivisions = () => {
  const { regionId } = useParams(); // Get the Region ID from the URL
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchData();
  }, [regionId]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/v1/regions/${regionId}`);
      console.log(response.data);
      setData(response.data);
      if (response.data) {
        const newChartData = formatChartData(response.data.divisionsData);
        setChartData(newChartData);
      } else {
        throw new Error("No data returned from API");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatChartData = (divisionsData) => {
    return {
      labels: divisionsData.map(item => `${item.name} (${item.value})`),
      ids: divisionsData.map(item => item.id),
      datasets: [{
        data: divisionsData.map(item => item.value),
        backgroundColor: colors.slice(0, divisionsData.length)
      }]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to fill the container
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        enabled: true,
      },
    },
    animation: {
      duration: 300,
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const divisionId = chartData.ids[index];
        navigate(`/divisions/${divisionId}`);
      }
    }
  };

  return (
    <div className="view-divisions">
      <h1>Divisions in {data && data.region && data.region.name}</h1>
      <div className="statistics">
        <div className="stat-item">
          <h2>Total Meters in Region</h2>
          <p>{data && data.totalMeters}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters Installed</h2>
          <p>{data && data.metersInstalled}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters QC Done</h2>
          <p>{data && data.metersQCDone}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters QC OK</h2>
          <p>{data && data.metersQCOK}</p>
        </div>
        <div className="stat-item">
          <h2>Total Meters QC Remaining</h2>
          <p>{data && data.metersQCRemaining}</p>
        </div>
        <div className="stat-item">
          <h2>Meters to be Installed</h2>
          <p>{data && data.metersToBeInstalled}</p>
        </div>
      </div>
      <div className="chart-container2">
        {chartData.labels && (
          <Pie data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default ViewDivisions;

