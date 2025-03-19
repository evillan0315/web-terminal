import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { setAuthHeaders } from '../utils/http';
// Register the components you need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,   // Register the point element
  LineElement,    // Register the line element if you're plotting lines
  BarElement,     // Register the bar element if you're using bars
  ArcElement,     // Register the arc element (for Pie chart)
  Title,
  Tooltip,
  Legend
);

const DashboardComponent = () => {
 const headers = setAuthHeaders();
  
  const [files, setFiles] = useState([]); // No TypeScript types here
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // Fetch files and folders from API
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setErrorMessage(''); // Reset any previous error messages

      try {
        const response = await fetch('https://board-dynamodb.duckdns.org/api/files', {
          method: 'GET',
          headers: headers,
        });

        const data = await response.json();
        console.log(data, 'data');
        if (response.ok) {
          setFiles(data.files); // Assuming the response has a `files` array
        } else {
          setErrorMessage(data.message || 'Error fetching files');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching the files.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []); 
  // Sample data for charts
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales in 2025',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Expenses in 2025',
        data: [45, 70, 65, 80, 40, 60],
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Technology', 'Marketing', 'Sales', 'R&D'],
    datasets: [
      {
        data: [300, 50, 100, 200],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* User Profile Section */}
      <div className="w-1/4 bg-white p-6 shadow-lg rounded-md m-4">
        <div className="flex flex-col items-center">
          <img
            className="w-24 h-24 rounded-full mb-4"
            src="https://via.placeholder.com/150"
            alt="User Avatar"
          />
          <h2 className="text-xl font-semibold mb-2">Eddie Villanueva</h2>
          <p className="text-gray-600">eddie@example.com</p>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Account</h3>
          <ul className="text-gray-600">
            <li>Dashboard</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Sales in 2025</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Expenses in 2025</h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Department Distribution</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;

