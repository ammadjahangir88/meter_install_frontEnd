import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import axiosInstance from '../utils/Axios';
import './Dashboard.css';
import MeterDetails from './MeterDetails';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/AuthContext';
import MapComponent from './MapComponent';

const colors = [
    "#FF5733", // Red Orange
    "#33FF57", // Neon Green
    "#3357FF", // Azure Radiance
    "#F333FF", // Electric Violet
    "#FF338F", // Cerise Red
    "#FAAAFF", // Screamin Green
    "#FFA633", // Neon Carrot
    "#339BFF", // Curious Blue
    "#8F33FF", // Electric Purple
    "#FF5733", // Persian Red
    "#FFAF33", // Sandy Brown
    "#FF335E", // Sunset Orange
    "#33FF8F", // Medium Aquamarine
    "#8F5733", // Raw Umber
    "#57A0FF", // Malibu
    "#FF3333", // Red
    "#33FFAF", // Caribbean Green
    "#7F33FF", // Electric Indigo
    "#FFC433", // Saffron
    "#33D4FF"  // Spray
];

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

function Dashboard() {
  const [data, setData] = useState(null);

  const [chartData, setChartData] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);  // State to track the active segment index
  const [divisionData, setDivisionData] = useState(null); // State to store data for the selected division
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use useAuth hook here
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/v1/meters/dashboard');
      console.log(response.data)
      setData(response.data);
      if (response.data) {
        const newChartData = formatChartData(response.data);
        setChartData(newChartData);
      } else {
        throw new Error("No data returned from API");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatChartData = (data) => {
    // Check if all required data arrays are present
    if (!data.divisionData || !data.statusData || !data.tariffData || !data.telecomData) {
      throw new Error("One or more required data sets are missing or improperly formatted");
    }
    return {
      division: {
        labels: data.divisionData.map(item => item.name),
        ids: data.divisionData.map(item => item.id), // Assuming the API now includes IDs
        datasets: [{
          data: data.divisionData.map(item => item.value),
          backgroundColor: colors
        }]
      },
      status: {
        labels: data.statusData.map(item => item.name),
        datasets: [{
          data: data.statusData.map(item => item.value),
          backgroundColor: colors
        }]
      },
      tariff: {
        labels: data.tariffData.map(item => item.name),
        datasets: [{
          data: data.tariffData.map(item => item.value),
          backgroundColor: colors
        }]
      },
      telecom: {
        labels: data.telecomData.map(item => item.name),
        datasets: [{
          data: data.telecomData.map(item => item.value),
          backgroundColor: colors
        }]
      }
    };
  };



  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Changed to right to make it vertical
      },
      tooltip: {
        enabled: true,
      },
    },
    animation: {
      duration: 300,
    },
  };
  
  const divisionOptions = {
    ...options, // Use the same base options
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const divisionId = chartData.division.ids[index];
        navigate(`/meters/${divisionId}`);
      }
    },
  };
  return (
    <div className="dashboard">
      <h1>Utility Meter Dashboard</h1>
      <div className="chart-container">
        {chartData.division && (
          <div>
            <h2>Division Data</h2>
            <Pie data={chartData.division} options={divisionOptions} />
          </div>
        )}
        {chartData.status && (
          <div>
            <h2>Status Data</h2>
            <Pie data={chartData.status} options={options} />
          </div>
        )}
        {chartData.tariff && (
          <div>
            <h2>Tariff Data</h2>
            <Pie data={chartData.tariff} options={options} />
          </div>
        )}
        {chartData.telecom && (
          <div>
            <h2>Telecom Data</h2>
            <Pie data={chartData.telecom} options={options} />
          </div>
        )}
      </div>
      <div>
      {data && data.metersData && <MapComponent meters={data.metersData} />}
    </div>
    </div>
  );
  
}

export default Dashboard;
