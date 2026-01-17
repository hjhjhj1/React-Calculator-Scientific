import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Bar, Pie } from 'react-chartjs-2';
import { getHistory, filterHistoryByDateRange } from './historyStorage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DataAnalysis = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const data = getHistory();
    setHistory(data);
    setFilteredHistory(data);

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setStartDate(lastWeek.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = filterHistoryByDateRange(startDate, endDate);
      setFilteredHistory(filtered);
    }
  };

  const handleReset = () => {
    setFilteredHistory(history);
  };

  const analyzeFunctions = () => {
    const functionCounts = {};
    filteredHistory.forEach(entry => {
      const functions = entry.expression.match(/(sin|cos|tan|log|sqrt|exp|fact|lg|pi|e)/gi);
      if (functions) {
        functions.forEach(func => {
          functionCounts[func.toLowerCase()] = (functionCounts[func.toLowerCase()] || 0) + 1;
        });
      }
    });
    return functionCounts;
  };

  const analyzeOperations = () => {
    const operationCounts = {};
    filteredHistory.forEach(entry => {
      const operations = entry.expression.match(/(\+|\-|\*|\/|\%|\^)/g);
      if (operations) {
        operations.forEach(op => {
          operationCounts[op] = (operationCounts[op] || 0) + 1;
        });
      }
    });
    return operationCounts;
  };

  const analyzeErrors = () => {
    const errorCounts = {
      '成功': 0,
      '语法错误': 0,
      '计算错误': 0,
      '其他错误': 0
    };

    filteredHistory.forEach(entry => {
      if (entry.success) {
        errorCounts['成功']++;
      } else if (entry.error) {
        const errorMessage = typeof entry.error === 'string' ? entry.error : String(entry.error);
        if (errorMessage.includes('syntax') || errorMessage.includes('Unexpected')) {
          errorCounts['语法错误']++;
        } else if (errorMessage.includes('NaN') || errorMessage.includes('Infinity')) {
          errorCounts['计算错误']++;
        } else {
          errorCounts['其他错误']++;
        }
      } else {
        errorCounts['其他错误']++;
      }
    });

    return errorCounts;
  };

  const calculateFrequency = () => {
    const hourlyData = new Array(24).fill(0);
    filteredHistory.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      hourlyData[hour]++;
    });
    return hourlyData;
  };

  const exportReport = () => {
    const functionStats = analyzeFunctions();
    const operationStats = analyzeOperations();
    const errorStats = analyzeErrors();
    const frequencyData = calculateFrequency();

    const report = {
      生成时间: new Date().toLocaleString('zh-CN'),
      时间范围: `${startDate} 至 ${endDate}`,
      总计算次数: filteredHistory.length,
      成功次数: filteredHistory.filter(e => e.success).length,
      失败次数: filteredHistory.filter(e => !e.success).length,
      常用函数统计: functionStats,
      运算符使用统计: operationStats,
      错误类型分布: errorStats,
      每小时计算频率: frequencyData,
      详细记录: filteredHistory
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `计算分析报告_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const functionData = {
    labels: Object.keys(analyzeFunctions()),
    datasets: [{
      label: '使用次数',
      data: Object.values(analyzeFunctions()),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const operationData = {
    labels: Object.keys(analyzeOperations()),
    datasets: [{
      label: '使用次数',
      data: Object.values(analyzeOperations()),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const errorData = {
    labels: Object.keys(analyzeErrors()),
    datasets: [{
      data: Object.values(analyzeErrors()),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const frequencyData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: '计算次数',
      data: calculateFrequency(),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '数据统计',
      },
    },
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center mb-0">计算历史数据分析</h2>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            返回计算器
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>时间筛选</Card.Title>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>开始日期</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>结束日期</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleFilter} className="mr-2">
                筛选
              </Button>
              <Button variant="secondary" onClick={handleReset} className="mr-2">
                重置
              </Button>
              <Button variant="success" onClick={exportReport}>
                导出报告
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>总计算次数</Card.Title>
              <h2>{filteredHistory.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>成功次数</Card.Title>
              <h2 style={{ color: 'green' }}>
                {filteredHistory.filter(e => e.success).length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>失败次数</Card.Title>
              <h2 style={{ color: 'red' }}>
                {filteredHistory.filter(e => !e.success).length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>成功率</Card.Title>
              <h2>
                {filteredHistory.length > 0
                  ? ((filteredHistory.filter(e => e.success).length / filteredHistory.length) * 100).toFixed(1)
                  : 0}%
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>常用函数统计（柱状图）</Card.Title>
              <Bar data={functionData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>运算符使用统计（柱状图）</Card.Title>
              <Bar data={operationData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>错误类型分布（饼图）</Card.Title>
              <Pie data={errorData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>每小时计算频率（柱状图）</Card.Title>
              <Bar data={frequencyData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Card.Title>详细计算记录</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>时间</th>
                <th>表达式</th>
                <th>结果</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.slice().reverse().map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.timestamp).toLocaleString('zh-CN')}</td>
                  <td>{entry.expression}</td>
                  <td>{entry.success ? entry.result : (typeof entry.error === 'string' ? entry.error : String(entry.error))}</td>
                  <td>
                    <span style={{
                      color: entry.success ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {entry.success ? '成功' : '失败'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DataAnalysis;
