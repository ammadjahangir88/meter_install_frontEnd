import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import axiosInstance from '../utils/Axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/AuthContext';
import MapComponent from './MapComponent';

const colors = [
  "#8E44AD", // Wisteria
  "#2980B9", // Belize Hole
  "#27AE60", // Nephritis
  "#16A085", // Green Sea
  "#F39C12", // Orange
  "#D35400", // Pumpkin
  "#C0392B", // Pomegranate
  "#BDC3C7", // Silver
  "#7F8C8D", // Asbestos
  "#34495E", // Wet Asphalt
  "#2C3E50", // Midnight Blue
  "#1ABC9C", // Turquoise
  "#3498DB", // Peter River
  "#9B59B6", // Amethyst
  "#E67E22", // Carrot
  "#E74C3C", // Alizarin
  "#95A5A6", // Concrete
  "#ECF0F1", // Clouds
  "#F1C40F", // Sun Flower
  "#E84393"  // Bright Pink
];

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

function Dashboard() {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState({});
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
    if (!data.divisionData || !data.subdivisionData || !data.statusData || !data.tariffData || !data.telecomData || !data.discos_data) {
      throw new Error("One or more required data sets are missing or improperly formatted");
    }
    return {
      discos: {
        labels: data.discos_data.map(item => `${item.name} (${item.value})`),
        ids: data.discos_data.map(item => item.id),
        datasets: [{
          data: data.discos_data.map(item => item.value),
          backgroundColor: colors.slice(0, data.discos_data.length)
        }]
      },
      subdivision: {
        labels: data.subdivisionData.map(item => `${item.name} (${item.value})`),
        ids: data.subdivisionData.map(item => item.id),
        datasets: [{
          data: data.subdivisionData.map(item => item.value),
          backgroundColor: colors.slice(0, data.subdivisionData.length)
        }]
      },
      division: {
        labels: data.divisionData.map(item => `${item.name} (${item.value})`),
        ids: data.divisionData.map(item => item.id),
        datasets: [{
          data: data.divisionData.map(item => item.value),
          backgroundColor: colors
        }]
      },
      status: {
        labels: data.statusData.map(item => `${item.name} (${item.value})`),
        datasets: [{
          data: data.statusData.map(item => item.value),
          backgroundColor: colors
        }]
      },
      tariff: {
        labels: data.tariffData.map(item => `${item.name} (${item.value})`),
        datasets: [{
          data: data.tariffData.map(item => item.value),
          backgroundColor: colors
        }]
      },
      telecom: {
        labels: data.telecomData.map(item => `${item.name} (${item.value})`),
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
        position: 'right', // Changed to right to make it vertical
      },
      tooltip: {
        enabled: true,
      },
    },
    animation: {
      duration: 300,
    },
  };

  const discoOptions = {
    ...options, // Use the same base options
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const discoId = chartData.discos.ids[index];
        navigate(`/discos/${discoId}`);
      }
    },
  };

  const subdivisionOptions = {
    ...options, // Use the same base options
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const subdivisionId = chartData.subdivision.ids[index];
        navigate(`/sub/meters/${subdivisionId}`);
      }
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
        {chartData.discos && (
          <div>
            <h2>Disco Data</h2>
            <Pie data={chartData.discos} options={discoOptions} />
          </div>
        )}
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
