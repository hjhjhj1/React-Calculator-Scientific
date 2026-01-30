import React, { useState, useEffect, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import {
  FaCalculator, FaCheckCircle, FaTimesCircle,
  FaChartPie, FaClock, FaDownload, FaTrash
} from 'react-icons/fa';
import { historyService } from '../../services/historyService';
import { analyticsService } from '../../services/analyticsService';
import StatCard from './StatCard';
import PieChartCard from './PieChartCard';
import BarChartCard from './BarChartCard';
import './AnalyticsDashboard.css';

const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange, onPresetChange }) => {
  const presets = [
    { label: 'Today', getRange: () => ({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
    { label: 'Last 7 Days', getRange: () => ({ start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
    { label: 'Last 30 Days', getRange: () => ({ start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
    { label: 'This Month', getRange: () => ({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
    { label: 'All Time', getRange: () => ({ start: '', end: '' }) }
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
      <span className="text-muted fw-medium">Filter by date:</span>
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          Quick Filters
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {presets.map((preset, idx) => (
            <Dropdown.Item key={idx} onClick={() => onPresetChange(preset.getRange())}>
              {preset.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <span className="text-muted">or</span>
      <div className="d-flex gap-2">
        <Form.Control
          type="date"
          size="sm"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          style={{ width: 'auto' }}
        />
        <span className="text-muted">to</span>
        <Form.Control
          type="date"
          size="sm"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          style={{ width: 'auto' }}
        />
      </div>
    </div>
  );
};

const ExportButtons = ({ onExportCSV, onExportJSON, onClearData }) => {
  return (
    <div className="d-flex gap-2 mb-4">
      <Button variant="success" size="sm" onClick={onExportCSV}>
        <FaDownload className="me-1" /> Export CSV
      </Button>
      <Button variant="info" size="sm" onClick={onExportJSON}>
        <FaDownload className="me-1" /> Export JSON
      </Button>
      <Button variant="outline-danger" size="sm" onClick={onClearData}>
        <FaTrash className="me-1" /> Clear All Data
      </Button>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(historyService.getHistory());
  };

  const filteredHistory = useMemo(() => {
    if (!startDate && !endDate) return history;

    let filtered = history;
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(r => new Date(r.timestamp) >= start);
    }
    if (endDate) {
      const end = new Date(endDate + 'T23:59:59');
      filtered = filtered.filter(r => new Date(r.timestamp) <= end);
    }
    return filtered;
  }, [history, startDate, endDate]);

  const analytics = useMemo(() => {
    return analyticsService.getAnalytics(filteredHistory);
  }, [filteredHistory]);

  const handlePresetChange = ({ start, end }) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleExportCSV = () => {
    const csv = analyticsService.exportToCSV(analytics, filteredHistory);
    downloadFile(csv, `calculator-report-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportJSON = () => {
    const json = analyticsService.exportToJSON(analytics, filteredHistory);
    downloadFile(json, `calculator-report-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all calculation history? This action cannot be undone.')) {
      historyService.clearHistory();
      setHistory([]);
    }
  };

  const topFunctions = analytics.functionUsage.slice(0, 8).filter(f => f.count > 0);
  const topOperators = analytics.operatorUsage.slice(0, 8).filter(o => o.count > 0);
  const errorTypes = analytics.errorTypes.filter(e => e.count > 0);
  const peakHours = analytics.peakHours.slice(0, 10);
  const weeklyData = analytics.weeklyPattern;

  return (
    <Container fluid className="analytics-dashboard py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">
          <FaChartPie className="me-2" />
          Analytics Dashboard
        </h3>
      </div>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onPresetChange={handlePresetChange}
      />

      <ExportButtons
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onClearData={handleClearData}
      />

      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Calculations"
            value={analytics.totalCalculations}
            icon={<FaCalculator size={24} />}
            color="primary"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Successful"
            value={analytics.successfulCalculations}
            icon={<FaCheckCircle size={24} />}
            color="success"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Failed"
            value={analytics.failedCalculations}
            icon={<FaTimesCircle size={24} />}
            color="danger"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Success Rate"
            value={`${analytics.successRate}%`}
            icon={<FaChartPie size={24} />}
            color="info"
          />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={6}>
          <PieChartCard
            title="Function Usage Distribution"
            data={topFunctions.map(f => f.count)}
            labels={topFunctions.map(f => f.name)}
          />
        </Col>
        <Col xs={12} lg={6}>
          <PieChartCard
            title="Operator Usage Distribution"
            data={topOperators.map(o => o.count)}
            labels={topOperators.map(o => o.name)}
            colors={['#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997']}
          />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={6}>
          <BarChartCard
            title="Calculations by Hour of Day"
            data={peakHours.map(h => h.count)}
            labels={peakHours.map(h => h.label)}
            color="#007bff"
          />
        </Col>
        <Col xs={12} lg={6}>
          <BarChartCard
            title="Calculations by Day of Week"
            data={weeklyData.map(d => d.count)}
            labels={weeklyData.map(d => d.day)}
            color="#28a745"
          />
        </Col>
      </Row>

      {errorTypes.length > 0 && (
        <Row className="g-3 mb-4">
          <Col xs={12} lg={6}>
            <PieChartCard
              title="Error Type Distribution"
              data={errorTypes.map(e => e.count)}
              labels={errorTypes.map(e => e.name)}
              colors={['#dc3545', '#fd7e14', '#ffc107', '#6c757d']}
            />
          </Col>
        </Row>
      )}

      <Row className="g-3">
        <Col xs={12}>
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom">
              <h6 className="mb-0 fw-bold">Calculation Frequency</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap gap-3">
                <div className="text-center">
                  <h5 className="mb-1 fw-bold">{analytics.calculationFrequency.last24Hours}</h5>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <div className="text-center">
                  <h5 className="mb-1 fw-bold">{analytics.calculationFrequency.last7Days}</h5>
                  <small className="text-muted">Last 7 Days</small>
                </div>
                <div className="text-center">
                  <h5 className="mb-1 fw-bold">{analytics.calculationFrequency.last30Days}</h5>
                  <small className="text-muted">Last 30 Days</small>
                </div>
                <div className="text-center">
                  <h5 className="mb-1 fw-bold">{analytics.calculationFrequency.allTime}</h5>
                  <small className="text-muted">All Time</small>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {filteredHistory.length === 0 && (
        <div className="text-center py-5">
          <FaCalculator size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No calculation history found</h5>
          <p className="text-muted">Start using the calculator to see analytics here</p>
        </div>
      )}
    </Container>
  );
};

export default AnalyticsDashboard;
