const STORAGE_KEY = 'calculator_history';

export const saveCalculation = (expression, result, error = null) => {
  const history = getCalculationHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    expression,
    result,
    error,
    functions: extractFunctions(expression),
    operators: extractOperators(expression),
  };
  history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
};

export const getCalculationHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const clearCalculationHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const extractFunctions = (expression) => {
  const functions = [];
  const functionPatterns = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'log', 'log10', 'ln', 'exp', 'sqrt', 'abs',
    'floor', 'ceil', 'round', 'max', 'min',
    'pow', 'factorial', 'fact'
  ];
  
  functionPatterns.forEach(func => {
    const regex = new RegExp(`${func}\\s*\\(`, 'gi');
    if (regex.test(expression)) {
      functions.push(func.toLowerCase());
    }
  });
  
  return functions;
};

export const extractOperators = (expression) => {
  const operators = [];
  const operatorPattern = /[\+\-\*\/\^\%]/g;
  let match;
  while ((match = operatorPattern.exec(expression)) !== null) {
    operators.push(match[0]);
  }
  return operators;
};

export const getStatistics = (startDate = null, endDate = null) => {
  let history = getCalculationHistory();
  
  if (startDate || endDate) {
    history = history.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      if (startDate && entryDate < new Date(startDate)) return false;
      if (endDate && entryDate > new Date(endDate)) return false;
      return true;
    });
  }
  
  const totalCalculations = history.length;
  const successfulCalculations = history.filter(e => !e.error).length;
  const failedCalculations = history.filter(e => e.error).length;
  
  const functionUsage = {};
  const operatorUsage = {};
  const hourlyDistribution = new Array(24).fill(0);
  const dailyDistribution = {};
  const errorTypes = {};
  
  history.forEach(entry => {
    const date = new Date(entry.timestamp);
    const hour = date.getHours();
    const dateKey = date.toISOString().split('T')[0];
    
    hourlyDistribution[hour]++;
    dailyDistribution[dateKey] = (dailyDistribution[dateKey] || 0) + 1;
    
    entry.functions?.forEach(func => {
      functionUsage[func] = (functionUsage[func] || 0) + 1;
    });
    
    entry.operators?.forEach(op => {
      operatorUsage[op] = (operatorUsage[op] || 0) + 1;
    });
    
    if (entry.error) {
      const errorType = entry.error.type || 'Unknown Error';
      errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
    }
  });
  
  const topFunctions = Object.entries(functionUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const topOperators = Object.entries(operatorUsage)
    .sort((a, b) => b[1] - a[1]);
  
  return {
    totalCalculations,
    successfulCalculations,
    failedCalculations,
    successRate: totalCalculations > 0 ? (successfulCalculations / totalCalculations * 100).toFixed(2) : 0,
    functionUsage,
    operatorUsage,
    topFunctions,
    topOperators,
    hourlyDistribution,
    dailyDistribution,
    errorTypes,
    history
  };
};

export const exportReport = (format = 'json') => {
  const stats = getStatistics();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  if (format === 'json') {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calculator-report-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } else if (format === 'csv') {
    let csv = 'Expression,Result,Timestamp,Error\n';
    stats.history.forEach(entry => {
      csv += `"${entry.expression}","${entry.result}","${entry.timestamp}","${entry.error || ''}"\n`;
    });
    const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calculator-report-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
