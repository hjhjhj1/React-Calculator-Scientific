import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getStatistics, exportReport, clearCalculationHistory } from '../utils/calculationHistory';
import { Button, Row, Col, Card, Form, Modal } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsDashboard = ({ show, onHide }) => {
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (show) {
      loadStats();
    }
  }, [show, startDate, endDate]);

  const loadStats = () => {
    const data = getStatistics(
      startDate || null,
      endDate || null
    );
    setStats(data);
  };

  const handleClearHistory = () => {
    clearCalculationHistory();
    setShowConfirmClear(false);
    loadStats();
  };

  const functionChartData = stats?.topFunctions ? {
    labels: stats.topFunctions.map(([name]) => name),
    datasets: [{
      label: '使用次数',
      data: stats.topFunctions.map(([, count]) => count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
        'rgba(255, 99, 255, 0.6)',
        'rgba(99, 255, 132, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(255, 99, 255, 1)',
        'rgba(99, 255, 132, 1)',
      ],
      borderWidth: 1,
    }],
  } : null;

  const operatorChartData = stats?.topOperators ? {
    labels: stats.topOperators.map(([name]) => {
      const opNames = {
        '+': '加法 (+)',
        '-': '减法 (-)',
        '*': '乘法 (×)',
        '/': '除法 (÷)',
        '^': '幂运算 (^)',
        '%': '取模 (%)'
      };
      return opNames[name] || name;
    }),
    datasets: [{
      label: '使用次数',
      data: stats.topOperators.map(([, count]) => count),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  } : null;

  const hourlyChartData = stats?.hourlyDistribution ? {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: '计算次数',
      data: stats.hourlyDistribution,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      tension: 0.4,
    }],
  } : null;

  const successRateData = stats ? {
    labels: ['成功', '失败'],
    datasets: [{
      data: [stats.successfulCalculations, stats.failedCalculations],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }],
  } : null;

  const errorTypeData = stats?.errorTypes && Object.keys(stats.errorTypes).length > 0 ? {
    labels: Object.keys(stats.errorTypes),
    datasets: [{
      data: Object.values(stats.errorTypes),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" className="analytics-modal">
        <Modal.Header closeButton>
          <Modal.Title>计算历史数据分析</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stats && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>开始日期</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>结束日期</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center stat-card">
                    <Card.Body>
                      <h3>{stats.totalCalculations}</h3>
                      <p className="text-muted">总计算次数</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center stat-card">
                    <Card.Body>
                      <h3>{stats.successRate}%</h3>
                      <p className="text-muted">成功率</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center stat-card">
                    <Card.Body>
                      <h3>{stats.successfulCalculations}</h3>
                      <p className="text-muted">成功计算</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center stat-card">
                    <Card.Body>
                      <h3>{stats.failedCalculations}</h3>
                      <p className="text-muted">失败计算</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Header>常用函数分布</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      {functionChartData && stats.topFunctions.length > 0 ? (
                        <Pie data={functionChartData} options={chartOptions} />
                      ) : (
                        <p className="text-center text-muted">暂无数据</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>运算符使用频率</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      {operatorChartData && stats.topOperators.length > 0 ? (
                        <Bar data={operatorChartData} options={barOptions} />
                      ) : (
                        <p className="text-center text-muted">暂无数据</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Header>计算成功率</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      {successRateData && stats.totalCalculations > 0 ? (
                        <Pie data={successRateData} options={chartOptions} />
                      ) : (
                        <p className="text-center text-muted">暂无数据</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>错误类型分布</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      {errorTypeData ? (
                        <Pie data={errorTypeData} options={chartOptions} />
                      ) : (
                        <p className="text-center text-muted">暂无错误数据</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={12}>
                  <Card>
                    <Card.Header>24小时计算分布</Card.Header>
                    <Card.Body style={{ height: '300px' }}>
                      {hourlyChartData && stats.totalCalculations > 0 ? (
                        <Line data={hourlyChartData} options={barOptions} />
                      ) : (
                        <p className="text-center text-muted">暂无数据</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => setShowConfirmClear(true)}>
            清空历史
          </Button>
          <Button variant="outline-primary" onClick={() => exportReport('json')}>
            导出 JSON
          </Button>
          <Button variant="outline-primary" onClick={() => exportReport('csv')}>
            导出 CSV
          </Button>
          <Button variant="secondary" onClick={onHide}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmClear} onHide={() => setShowConfirmClear(false)}>
        <Modal.Header closeButton>
          <Modal.Title>确认清空</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          确定要清空所有计算历史记录吗？此操作不可撤销。
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmClear(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleClearHistory}>
            确认清空
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AnalyticsDashboard;
