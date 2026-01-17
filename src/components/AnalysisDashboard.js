import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Button, Card, Row, Col, Form, Container } from 'react-bootstrap';
import { FaDownload, FaTrash } from 'react-icons/fa';
import {
  analyzeHistory,
  getHistoryByDateRange,
  clearHistory,
  generateReport,
  exportToCSV,
  exportToJSON
} from '../utils/calculationHistory';

const AnalysisDashboard = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = (history = null) => {
    const data = analyzeHistory(history);
    setAnalysisData(data);
    setFilteredHistory(history);
  };

  const handleFilter = (e) => {
    e.preventDefault();

    if (!dateRange.start || !dateRange.end) {
      alert('请选择开始和结束日期');
      return;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    if (startDate > endDate) {
      alert('开始日期不能晚于结束日期');
      return;
    }

    const history = getHistoryByDateRange(startDate, endDate);
    loadData(history);
    setIsFiltering(true);
  };

  const handleReset = () => {
    setDateRange({ start: '', end: '' });
    loadData();
    setIsFiltering(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有计算历史吗？此操作不可恢复。')) {
      clearHistory();
      loadData();
      setIsFiltering(false);
    }
  };

  const handleExportCSV = () => {
    const history = filteredHistory || null;
    const csvContent = exportToCSV(history || []);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `calculation_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const report = generateReport(analysisData || {});
    const jsonContent = exportToJSON(report);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `calculation_analysis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (!analysisData) {
    return (
      <Container className="mt-4">
        <h2 className="mb-4">数据分析</h2>
        <p className="text-muted">暂无计算历史数据</p>
      </Container>
    );
  }

  // 常用函数饼图数据
  const pieData = {
    labels: Object.keys(analysisData.functionsUsed),
    datasets: [{
      label: '使用次数',
      data: Object.values(analysisData.functionsUsed),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF'
      ]
    }]
  };

  // 计算频率柱状图数据
  const barData = {
    labels: Object.keys(analysisData.calculationFrequency),
    datasets: [{
      label: '计算次数',
      data: Object.values(analysisData.calculationFrequency),
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      borderWidth: 1
    }]
  };

  // 错误类型分布饼图数据
  const errorPieData = {
    labels: Object.keys(analysisData.errorTypes),
    datasets: [{
      label: '错误次数',
      data: Object.values(analysisData.errorTypes),
      backgroundColor: [
        '#FF6384',
        '#FF9F40',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#FF9F40',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">数据分析仪表板</h2>

      {/* 筛选和导出区域 */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form onSubmit={handleFilter} inline>
                <Form.Group className="mb-2 mr-2">
                  <Form.Label className="mr-2">开始日期:</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-2 mr-2">
                  <Form.Label className="mr-2">结束日期:</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="mb-2 mr-2">
                  筛选
                </Button>
                <Button variant="secondary" onClick={handleReset} className="mb-2">
                  重置
                </Button>
              </Form>
            </Col>
            <Col md={6} className="text-right">
              <Button variant="success" onClick={handleExportCSV} className="mb-2 mr-2">
                <FaDownload /> 导出CSV
              </Button>
              <Button variant="info" onClick={handleExportJSON} className="mb-2 mr-2">
                <FaDownload /> 导出JSON
              </Button>
              <Button variant="danger" onClick={handleClearHistory} className="mb-2">
                <FaTrash /> 清空历史
              </Button>
            </Col>
          </Row>

          {isFiltering && (
            <div className="mt-2 alert alert-info">
              已筛选数据，共 {analysisData.totalCalculations} 条记录
              <Button variant="outline-info" size="sm" onClick={handleReset} className="ml-2">
                取消筛选
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 统计摘要 */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>总计算次数</Card.Title>
              <Card.Text className="h2">{analysisData.totalCalculations}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>成功率</Card.Title>
              <Card.Text className="h2 text-success">{analysisData.successRate}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>错误总数</Card.Title>
              <Card.Text className="h2 text-danger">
                {analysisData.totalCalculations -
                  Math.round(analysisData.totalCalculations * analysisData.successRate / 100)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>使用的函数类型</Card.Title>
              <Card.Text className="h2">{Object.keys(analysisData.functionsUsed).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>常用函数分布</Card.Header>
            <Card.Body>
              {Object.keys(analysisData.functionsUsed).length > 0 ? (
                <Pie data={pieData} />
              ) : (
                <p className="text-center text-muted">暂无函数使用数据</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>错误类型分布</Card.Header>
            <Card.Body>
              {Object.keys(analysisData.errorTypes).length > 0 ? (
                <Pie data={errorPieData} />
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
            <Card.Header>计算频率分布（按小时）</Card.Header>
            <Card.Body>
              {Object.keys(analysisData.calculationFrequency).length > 0 ? (
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                  height={300}
                />
              ) : (
                <p className="text-center text-muted">暂无计算频率数据</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 详细统计数据 */}
      <Card>
        <Card.Header>详细统计</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>函数使用详情</h5>
              <ul className="list-group">
                {Object.entries(analysisData.functionsUsed)
                  .sort((a, b) => b[1] - a[1])
                  .map(([func, count]) => (
                    <li key={func} className="list-group-item d-flex justify-content-between align-items-center">
                      {func}
                      <span className="badge badge-primary badge-pill">{count}</span>
                    </li>
                  ))}
              </ul>
            </Col>
            <Col md={6}>
              <h5>错误详情</h5>
              <ul className="list-group">
                {Object.entries(analysisData.errorTypes).map(([type, count]) => (
                  <li key={type} className="list-group-item d-flex justify-content-between align-items-center">
                    {type}
                    <span className="badge badge-danger badge-pill">{count}</span>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AnalysisDashboard;
