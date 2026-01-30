import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartCard = ({ title, data, labels, colors }) => {
  const defaultColors = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6610f2'
  ];

  const chartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: colors || defaultColors.slice(0, data.length),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    }
  };

  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Header className="bg-white border-bottom">
          <h6 className="mb-0 fw-bold">{title}</h6>
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <p className="text-muted mb-0">No data available</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white border-bottom">
        <h6 className="mb-0 fw-bold">{title}</h6>
      </Card.Header>
      <Card.Body style={{ height: '250px' }}>
        <Pie data={chartData} options={options} />
      </Card.Body>
    </Card>
  );
};

export default PieChartCard;
