import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const BAR_COLORS = [
 '#FF6384',
 '#36A2EB',
 '#FFCE56',
 '#4BC0C0',
 '#9966FF',
 '#FF9F40',
 '#FF6384',
 '#C9CBCF',
 '#7BC225',
 '#E84855',
 '#4ECDC4',
 '#45B7D1',
 '#96CEB4',
 '#FFEAA7',
 '#DDA0DD',
 '#98D8C8'
];
const BarChart = ({ data, options = {}, title }) => {
 const chartData = {
 labels: data.labels || [],
 datasets: [
 {
 label: data.datasetLabel || '数量',
 data: data.values || [],
 backgroundColor: data.colors || BAR_COLORS.slice(0, data.values?.length || 16),
 borderColor: data.borderColors || Array(data.values?.length || 16).fill('rgba(0,0,0,0.1)'),
 borderWidth: 1,
 borderRadius: 4,
 borderSkipped: false
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
 <Bar data={chartData} options={chartOptions}/>
 </div>);
};
export default BarChart;
