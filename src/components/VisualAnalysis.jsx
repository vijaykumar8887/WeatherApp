import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Registering components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisualAnalysis = ({ data }) => {
  // Prepare chart data for temperature (Line Chart)
  const tempChartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Temperature',
        data: Object.values(data).map(item => item.temp),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Prepare histogram data for temperature distribution
  const temperatureValues = Object.values(data).map(item => item.temp);
  const histogramData = {
    labels: Object.keys(data), // Create labels for bins
    datasets: [
      {
        label: 'Temperature Distribution',
        data: temperatureValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Visual Analysis</h2>
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 mb-4">
          <h3 className="text-lg font-semibold">Temperature Trend</h3>
          <Line data={tempChartData} />
        </div>
        <div className="w-full md:w-1/2 mb-4">
          <h3 className="text-lg font-semibold">Temperature Distribution Histogram</h3>
          <Bar data={histogramData} />
        </div>
      </div>
    </div>
  );
};

export default VisualAnalysis;
