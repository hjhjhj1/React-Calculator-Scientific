import { historyService } from './historyService';

const FUNCTION_NAMES = ['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'factorial', 'pi', '1/x', '%'];
const OPERATORS = ['+', '-', '*', '/', '^', '(', ')'];

export const analyticsService = {
  getAnalytics(history = null) {
    const data = history || historyService.getHistory();
    
    return {
      totalCalculations: data.length,
      successfulCalculations: data.filter(r => r.success).length,
      failedCalculations: data.filter(r => !r.success).length,
      successRate: data.length > 0 ? (data.filter(r => r.success).length / data.length * 100).toFixed(2) : 0,
      functionUsage: this.getFunctionUsage(data),
      operatorUsage: this.getOperatorUsage(data),
      errorTypes: this.getErrorTypes(data),
      calculationFrequency: this.getCalculationFrequency(data),
      peakHours: this.getPeakHours(data),
      weeklyPattern: this.getWeeklyPattern(data)
    };
  },

  getFunctionUsage(data) {
    const usage = {};
    FUNCTION_NAMES.forEach(fn => usage[fn] = 0);
    
    data.forEach(record => {
      if (record.expression) {
        FUNCTION_NAMES.forEach(fn => {
          if (record.expression.toLowerCase().includes(fn.toLowerCase())) {
            usage[fn]++;
          }
        });
      }
      if (record.functionUsed) {
        usage[record.functionUsed] = (usage[record.functionUsed] || 0) + 1;
      }
    });
    
    return Object.entries(usage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getOperatorUsage(data) {
    const usage = {};
    OPERATORS.forEach(op => usage[op] = 0);
    
    data.forEach(record => {
      if (record.expression) {
        OPERATORS.forEach(op => {
          const regex = op === '^' ? /\^/g : new RegExp(`\\${op}`, 'g');
          const matches = record.expression.match(regex);
          if (matches) {
            usage[op] += matches.length;
          }
        });
      }
    });
    
    return Object.entries(usage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getErrorTypes(data) {
    const errors = {};
    
    data.filter(r => !r.success && r.errorType).forEach(record => {
      errors[r.errorType] = (errors[r.errorType] || 0) + 1;
    });
    
    data.filter(r => !r.success && !r.errorType).forEach(() => {
      errors['Unknown Error'] = (errors['Unknown Error'] || 0) + 1;
    });
    
    return Object.entries(errors)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getCalculationFrequency(data) {
    const frequency = {
      last24Hours: 0,
      last7Days: 0,
      last30Days: 0,
      allTime: data.length
    };
    
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    data.forEach(record => {
      const recordDate = new Date(record.timestamp);
      if (recordDate >= dayAgo) frequency.last24Hours++;
      if (recordDate >= weekAgo) frequency.last7Days++;
      if (recordDate >= monthAgo) frequency.last30Days++;
    });
    
    return frequency;
  },

  getPeakHours(data) {
    const hours = {};
    for (let i = 0; i < 24; i++) {
      hours[i] = 0;
    }
    
    data.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      hours[hour]++;
    });
    
    return Object.entries(hours)
      .map(([hour, count]) => ({ 
        hour: parseInt(hour), 
        label: `${hour}:00`, 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  },

  getWeeklyPattern(data) {
    const days = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    dayNames.forEach(day => days[day] = 0);
    
    data.forEach(record => {
      const dayIndex = new Date(record.timestamp).getDay();
      days[dayNames[dayIndex]]++;
    });
    
    return dayNames.map(day => ({ day, count: days[day] }));
  },

  exportToCSV(analytics, history) {
    let csv = 'Calculation History Report\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += 'Summary Statistics\n';
    csv += `Total Calculations,${analytics.totalCalculations}\n`;
    csv += `Successful,${analytics.successfulCalculations}\n`;
    csv += `Failed,${analytics.failedCalculations}\n`;
    csv += `Success Rate,${analytics.successRate}%\n\n`;
    
    csv += 'Function Usage\n';
    csv += 'Function,Count\n';
    analytics.functionUsage.forEach(({ name, count }) => {
      csv += `${name},${count}\n`;
    });
    csv += '\n';
    
    csv += 'Operator Usage\n';
    csv += 'Operator,Count\n';
    analytics.operatorUsage.forEach(({ name, count }) => {
      csv += `"${name}",${count}\n`;
    });
    csv += '\n';
    
    csv += 'Error Types\n';
    csv += 'Error Type,Count\n';
    analytics.errorTypes.forEach(({ name, count }) => {
      csv += `${name},${count}\n`;
    });
    csv += '\n';
    
    csv += 'Detailed History\n';
    csv += 'ID,Timestamp,Expression,Result,Success,Function Used\n';
    history.forEach(record => {
      csv += `${record.id},${record.timestamp},"${record.expression || ''}","${record.result || ''}",${record.success},${record.functionUsed || ''}\n`;
    });
    
    return csv;
  },

  exportToJSON(analytics, history) {
    return JSON.stringify({
      reportGenerated: new Date().toISOString(),
      summary: {
        totalCalculations: analytics.totalCalculations,
        successfulCalculations: analytics.successfulCalculations,
        failedCalculations: analytics.failedCalculations,
        successRate: analytics.successRate
      },
      functionUsage: analytics.functionUsage,
      operatorUsage: analytics.operatorUsage,
      errorTypes: analytics.errorTypes,
      calculationFrequency: analytics.calculationFrequency,
      peakHours: analytics.peakHours.slice(0, 5),
      weeklyPattern: analytics.weeklyPattern,
      detailedHistory: history
    }, null, 2);
  }
};
