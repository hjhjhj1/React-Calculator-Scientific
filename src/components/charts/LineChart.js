import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
const LineChart = ({ data, options = {}, title, showPoints = true }) => {
 const chartData = {
 labels: data.labels || [],
 datasets: [
 {
 label: data.datasetLabel || '数量',
 data: data.values || [],
 borderColor: data.borderColor || '#36A2EB',
 backgroundColor: data.fill ? 'rgba(54, 162, 235, 0.1)' : 'transparent',
 fill: data.fill || false,
 tension: 0.4,
 pointRadius: showPoints ? 4 : 0,
 pointHoverRadius: 6,
 pointBackgroundColor: data.pointBackgroundColor || '#36A2EB',
 pointBorderColor: '#fff',
 pointBorderWidth: 2
 }
 ]
 };
 const defaultOptions = {
 responsive: true,
 maintainAspectRatio: false,
 plugins: {
 legend: {
 display: false
 },
 tooltip: {
 backgroundColor: 'rgba(0,0,0,0.8)',
 padding: 12,
 titleFont: {
 size: 14
 },
 bodyFont: {
 size: 13
 },
 callbacks: {
 label: function(context) {
 return `${context.dataset.label}: ${context.parsed.y}`;
 }
 }
 }
 },
 scales: {
 x: {
 grid: {
 display: false
 },
 ticks: {
 font: {
 size: 11
 }
 }
 },
 y: {
 beginAtZero: true,
 grid: {
 color: 'rgba(0,0,0,0.05)'
 },
 ticks: {
 font: {
 size: 11
 },
 stepSize: 1
 }
 }
 },
 animation: {
 duration: 500
 }
 };
 const chartOptions = { ...defaultOptions, ...options };
 return (<div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
 {title && (<h5 className="chart-title text-center mb-3" style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>
 {title}
 </h5>)}
 <Line data={chartData} options={chartOptions}/>
 </div>);
};
export default LineChart;
