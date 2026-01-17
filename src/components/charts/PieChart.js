import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#C9CBCF',
  '#7BC225',
  '#E84855'
];
const PieChart = ({ data, options = {}, title }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        data: data.values || [],
        backgroundColor: data.colors || COLORS.slice(0, data.values?.length || 10),
        borderColor: data.borderColors || Array(data.values?.length || 10).fill('#fff'),
        borderWidth: data.borderWidth || 2
      }
    ]
  };
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  const chartOptions = { ...defaultOptions, ...options };
  return (<div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
      {title && (<h5 className="chart-title text-center mb-3" style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>
          {title}
        </h5>)}
      <Pie data={chartData} options={chartOptions}/>
    </div>);
};
export default PieChart;
