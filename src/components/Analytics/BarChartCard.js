import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartCard = ({ title, data, labels, color = '#007bff', horizontal = false }) => {
  const chartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: data.map(() => color),
      borderColor: data.map(() => color),
      borderWidth: 1,
      borderRadius: 4,
      barThickness: horizontal ? 20 : 'flex'
    }]
  };

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Count: ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: horizontal ? 0 : 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { precision: 0 }
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
      <Card.Body style={{ height: '280px' }}>
        <Bar data={chartData} options={options} />
      </Card.Body>
    </Card>
  );
};

export default BarChartCard;
