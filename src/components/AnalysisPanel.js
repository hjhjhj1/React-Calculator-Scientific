import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Badge, Table } from 'react-bootstrap';
import HistoryManager from '../history/HistoryManager';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import { saveAs } from 'file-saver';
import { FaDownload, FaFilter, FaChartPie, FaChartBar, FaClock } from 'react-icons/fa';
const AnalysisPanel = ({ onClose }) => {
 const [records, setRecords] = useState([]);
 const [statistics, setStatistics] = useState(null);
 const [startDate, setStartDate] = useState('');
 const [endDate, setEndDate] = useState('');
 const [filteredRecords, setFilteredRecords] = useState([]);
 const [activeTab, setActiveTab] = useState('overview');
 const [showFilters, setShowFilters] = useState(false);
 useEffect(() => {
 loadHistory();
 }, []);
 const loadHistory = () => {
 const history = HistoryManager.getHistory();
 setRecords(history);
 setFilteredRecords(history);
 updateStatistics(history);
 };
 const updateStatistics = (data) => {
 const stats = HistoryManager.getStatistics(data);
 setStatistics(stats);
 };
 const handleFilter = () => {
 if (startDate && endDate) {
 const filtered = HistoryManager.getRecordsByTimeRange(startDate, endDate);
 setFilteredRecords(filtered);
 updateStatistics(filtered);
 }
 };
 const handleResetFilters = () => {
 setStartDate('');
 setEndDate('');
 setFilteredRecords(records);
 updateStatistics(records);
 setShowFilters(false);
 };
 const generateReport = () => {
 if (!statistics)
 return;
 const report = {
 generatedAt: new Date().toISOString(),
 timeRange: startDate && endDate ? `${startDate} 至 ${endDate}` : '全部时间',
 statistics: statistics,
 records: filteredRecords.slice(0, 50)
 };
 const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
 saveAs(blob, `calculator_analysis_${Date.now()}.json`);
 };
 const generateCSVReport = () => {
 if (!statistics)
 return;
 const headers = ['表达式', '结果', '时间', '错误类型', '使用的函数', '操作符'];
 const rows = filteredRecords.slice(0, 100).map(record => [
 record.expression,
 record.result || '错误',
 new Date(record.timestamp).toLocaleString('zh-CN'),
 record.error?.type || '无',
 record.functionsUsed?.join(', ') || '无',
 record.operations?.join(', ') || '无'
 ]);
 let csvContent = headers.join(',') + '\n';
 rows.forEach(row => {
 csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
 });
 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
 saveAs(blob, `calculator_analysis_${Date.now()}.csv`);
 };
 const getErrorChartData = () => {
 if (!statistics || !statistics.errorTypeDistribution)
 return { labels: [], values: [] };
 const entries = Object.entries(statistics.errorTypeDistribution);
 return {
 labels: entries.map(([type]) => HistoryManager.getLocalizedErrorType(type)),
 values: entries.map(([, count]) => count)
 };
 };
 const getFunctionChartData = () => {
 if (!statistics || !statistics.functionUsage)
 return { labels: [], values: [] };
 const entries = Object.entries(statistics.functionUsage);
 return {
 labels: entries.map(([func]) => HistoryManager.getLocalizedFunctionName(func)),
 values: entries.map(([, count]) => count)
 };
 };
 const getOperationChartData = () => {
 if (!statistics || !statistics.operationUsage)
 return { labels: [], values: [] };
 const entries = Object.entries(statistics.operationUsage);
 return {
 labels: entries.map(([op]) => op),
 values: entries.map(([, count]) => count)
 };
 };
 const getDailyChartData = () => {
 const dailyData = HistoryManager.getCalculationsByDay(filteredRecords, 7);
 return {
 labels: dailyData.map(d => d.date),
 values: dailyData.map(d => d.count),
 datasetLabel: '计算次数'
 };
 };
 const getHourlyChartData = () => {
 const hourlyData = HistoryManager.getCalculationsByHour(filteredRecords);
 return {
 labels: hourlyData.map((_, i) => `${i}:00`),
 values: hourlyData,
 datasetLabel: '计算次数'
 };
 };
 if (!statistics) {
 return (<div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
 <div className="spinner-border" role="status">
 <span className="sr-only">加载中...</span>
 </div>
 </div>);
 }
 return (<div className="analysis-panel" style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
 <Card className="shadow-sm">
 <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
 <h4 className="mb-0">
 <FaChartBar className="mr-2"/>
 计算历史分析
 </h4>
 <Button variant="outline-light" size="sm" onClick={onClose}>
 关闭
 </Button>
 </Card.Header>
 <Card.Body>
 <div className="mb-4">
 <Button variant="outline-primary" size="sm" onClick={() => setShowFilters(!showFilters)} className="mr-2">
 <FaFilter className="mr-1"/>
 {showFilters ? '隐藏筛选器' : '显示筛选器'}
 </Button>
 <Button variant="success" size="sm" onClick={generateReport} className="mr-2">
 <FaDownload className="mr-1"/>
 导出JSON
 </Button>
 <Button variant="info" size="sm" onClick={generateCSVReport}>
 <FaDownload className="mr-1"/>
 导出CSV
 </Button>
 </div>
 {showFilters && (<Card className="mb-4">
 <Card.Body>
 <Form.Row>
 <Col md={4}>
 <Form.Group controlId="startDate">
 <Form.Label>开始日期</Form.Label>
 <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
 </Form.Group>
 </Col>
 <Col md={4}>
 <Form.Group controlId="endDate">
 <Form.Label>结束日期</Form.Label>
 <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
 </Form.Group>
 </Col>
 <Col md={4} className="d-flex align-items-end">
 <Button variant="primary" onClick={handleFilter} className="mr-2" block>
 应用筛选
 </Button>
 </Col>
 </Form.Row>
 <Button variant="outline-secondary" size="sm" onClick={handleResetFilters}>
 重置筛选
 </Button>
 </Card.Body>
 </Card>)}
 <div className="mb-3">
 <Button variant={activeTab === 'overview' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setActiveTab('overview')} className="mr-2">
 概览
 </Button>
 <Button variant={activeTab === 'charts' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setActiveTab('charts')} className="mr-2">
 <FaChartPie className="mr-1"/>
 图表
 </Button>
 <Button variant={activeTab === 'history' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setActiveTab('history')}>
 <FaClock className="mr-1"/>
 历史记录
 </Button>
 </div>
 {activeTab === 'overview' && (<div>
 <Row className="mb-4">
 <Col md={3}>
 <Card className="text-center">
 <Card.Body>
 <Card.Title className="text-primary">{statistics.totalCalculations}</Card.Title>
 <Card.Text className="text-muted">总计算次数</Card.Text>
 </Card.Body>
 </Card>
 </Col>
 <Col md={3}>
 <Card className="text-center">
 <Card.Body>
 <Card.Title className="text-success">{statistics.successfulCalculations}</Card.Title>
 <Card.Text className="text-muted">成功次数</Card.Text>
 </Card.Body>
 </Card>
 </Col>
 <Col md={3}>
 <Card className="text-center">
 <Card.Body>
 <Card.Title className="text-danger">{statistics.failedCalculations}</Card.Title>
 <Card.Text className="text-muted">失败次数</Card.Text>
 </Card.Body>
 </Card>
 </Col>
 <Col md={3}>
 <Card className="text-center">
 <Card.Body>
 <Card.Title className="text-warning">{statistics.errorRate}%</Card.Title>
 <Card.Text className="text-muted">错误率</Card.Text>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 <Row className="mb-4">
 <Col md={6}>
 <Card>
 <Card.Header>常用函数</Card.Header>
 <Card.Body>
 {Object.keys(statistics.functionUsage || {}).length > 0 ? (<Table striped bordered size="sm">
 <thead>
 <tr>
 <th>函数</th>
 <th>使用次数</th>
 <th>占比</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(statistics.functionUsage)
 .sort((a, b) => b[1] - a[1])
 .slice(0, 5)
 .map(([func, count]) => (<tr key={func}>
 <td>{HistoryManager.getLocalizedFunctionName(func)}</td>
 <td>{count}</td>
 <td>{((count / statistics.totalCalculations) * 100).toFixed(1)}%</td>
 </tr>))}
 </tbody>
 </Table>) : (<p className="text-muted text-center">暂无函数使用数据</p>)}
 </Card.Body>
 </Card>
 </Col>
 <Col md={6}>
 <Card>
 <Card.Header>常用操作符</Card.Header>
 <Card.Body>
 {Object.keys(statistics.operationUsage || {}).length > 0 ? (<Table striped bordered size="sm">
 <thead>
 <tr>
 <th>操作符</th>
 <th>使用次数</th>
 <th>占比</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(statistics.operationUsage)
 .sort((a, b) => b[1] - a[1])
 .slice(0, 5)
 .map(([op, count]) => (<tr key={op}>
 <td><Badge variant="info">{op}</Badge></td>
 <td>{count}</td>
 <td>{((count / statistics.totalCalculations) * 100).toFixed(1)}%</td>
 </tr>))}
 </tbody>
 </Table>) : (<p className="text-muted text-center">暂无操作符使用数据</p>)}
 </Card.Body>
 </Card>
 </Col>
 </Row>
 <Row className="mb-4">
 <Col md={6}>
 <Card>
 <Card.Header>错误类型分布</Card.Header>
 <Card.Body>
 {Object.keys(statistics.errorTypeDistribution || {}).length > 0 ? (<Table striped bordered size="sm">
 <thead>
 <tr>
 <th>错误类型</th>
 <th>发生次数</th>
 <th>占比</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(statistics.errorTypeDistribution)
 .sort((a, b) => b[1] - a[1])
 .map(([type, count]) => (<tr key={type}>
 <td>{HistoryManager.getLocalizedErrorType(type)}</td>
 <td>{count}</td>
 <td>{((count / statistics.failedCalculations) * 100).toFixed(1)}%</td>
 </tr>))}
 </tbody>
 </Table>) : (<p className="text-muted text-center">暂无错误数据</p>)}
 </Card.Body>
 </Card>
 </Col>
 <Col md={6}>
 <Card>
 <Card.Header>使用习惯</Card.Header>
 <Card.Body>
 <Table striped bordered size="sm">
 <tbody>
 <tr>
 <td>最常用函数</td>
 <td>{statistics.mostUsedFunction ? HistoryManager.getLocalizedFunctionName(statistics.mostUsedFunction[0]) : '-'}</td>
 </tr>
 <tr>
 <td>最常用操作符</td>
 <td>{statistics.mostUsedOperation ? statistics.mostUsedOperation[0] : '-'}</td>
 </tr>
 <tr>
 <td>日均计算次数</td>
 <td>{statistics.averageCalculationsPerDay}</td>
 </tr>
 <tr>
 <td>高峰时段</td>
 <td>{statistics.peakHour ? `${statistics.peakHour.hour}:00 (${statistics.peakHour.count}次)` : '-'}</td>
 </tr>
 </tbody>
 </Table>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 </div>)}
 {activeTab === 'charts' && (<div>
 <Row className="mb-4">
 <Col md={6}>
 <Card>
 <Card.Body>
 <PieChart data={getFunctionChartData()} title="函数使用分布"/>
 </Card.Body>
 </Card>
 </Col>
 <Col md={6}>
 <Card>
 <Card.Body>
 <PieChart data={getOperationChartData()} title="操作符使用分布"/>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 <Row className="mb-4">
 <Col md={6}>
 <Card>
 <Card.Body>
 <PieChart data={getErrorChartData()} title="错误类型分布"/>
 </Card.Body>
 </Card>
 </Col>
 <Col md={6}>
 <Card>
 <Card.Body>
 <BarChart data={getOperationChartData()} title="操作符使用频率"/>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 <Row className="mb-4">
 <Col md={6}>
 <Card>
 <Card.Body>
 <LineChart data={getDailyChartData()} title="近7日计算趋势" fill={true}/>
 </Card.Body>
 </Card>
 </Col>
 <Col md={6}>
 <Card>
 <Card.Body>
 <LineChart data={getHourlyChartData()} title="24小时计算分布" showPoints={false}/>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 </div>)}
 {activeTab === 'history' && (<div>
 <Card>
 <Card.Header>计算历史记录</Card.Header>
 <Card.Body>
 {filteredRecords.length > 0 ? (<Table striped bordered hover responsive size="sm">
 <thead>
 <tr>
 <th>#</th>
 <th>表达式</th>
 <th>结果</th>
 <th>时间</th>
 <th>状态</th>
 </tr>
 </thead>
 <tbody>
 {filteredRecords.slice(0, 50).map((record, index) => (<tr key={record.id} className={record.error ? 'table-danger' : ''}>
 <td>{index + 1}</td>
 <td><code>{record.expression}</code></td>
 <td>{record.result || (<Badge variant="danger">错误</Badge>)}</td>
 <td>{new Date(record.timestamp).toLocaleString('zh-CN')}</td>
 <td>{record.error ? (<Badge variant="danger">{HistoryManager.getLocalizedErrorType(record.error.type)}</Badge>) : (<Badge variant="success">成功</Badge>)}</td>
 </tr>))}
 </tbody>
 </Table>) : (<p className="text-muted text-center">暂无计算记录</p>)}
 </Card.Body>
 </Card>
 </div>)}
 </Card.Body>
 </Card>
 </div>);
};
export default AnalysisPanel;
