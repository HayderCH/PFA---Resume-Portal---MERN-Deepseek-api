import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  analyticsData,
  userEvolutionData,
  averageResumesPerUser,
} from "../assets/assets";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Add this
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import Navbar from "../components/Navbar";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Register this
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter data based on selected category
  const filteredData =
    selectedCategory === "All"
      ? analyticsData
      : analyticsData.filter((item) => item.category === selectedCategory);

  // Prepare data for the bar chart
  const barChartData = {
    labels: filteredData.map((item) => item.field),
    datasets: [
      {
        label: "Number of Candidates",
        data: filteredData.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#ddd",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the line chart (user evolution)
  const lineChartData = {
    labels: userEvolutionData.map((item) => item.week),
    datasets: [
      {
        label: "Total Users",
        data: userEvolutionData.map((item) => item.users),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Candidate Distribution by Field",
      },
    },
  };

  // Download chart as an image
  const downloadChart = () => {
    const canvas = document.querySelector("canvas");
    canvas.toBlob((blob) => {
      saveAs(blob, "chart.png");
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Analytics</h1>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="mr-2 font-medium">
            Filter by Category:
          </label>
          <select
            id="category"
            className="border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="AI">AI</option>
            <option value="Development">Development</option>
            <option value="Security">Security</option>
            <option value="Design">Design</option>
          </select>
        </div>

        {/* Summary Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p>
            Total Candidates:{" "}
            {filteredData.reduce((sum, item) => sum + item.count, 0)}
          </p>
          <p>Average Resumes per User: {averageResumesPerUser}</p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <Bar data={barChartData} options={options} />
          <button
            onClick={downloadChart}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download Chart
          </button>
        </div>

        {/* Line Chart for User Evolution */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            User Evolution (Weekly)
          </h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        {/* Data Table */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Data Table</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Field</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">
                  Number of Candidates
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.field}>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.field}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Analytics;
