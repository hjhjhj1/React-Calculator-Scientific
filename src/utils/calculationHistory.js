// 计算历史记录工具类

const STORAGE_KEY = 'calculation_history';

// 保存计算记录
export const saveCalculation = (expression, result, isError = false, errorType = null) => {
  const history = getHistory();
  const record = {
    id: Date.now(),
    expression,
    result,
    isError,
    errorType,
    timestamp: new Date().toISOString(),
    functionsUsed: extractFunctions(expression)
  };
  
  history.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
};

// 获取所有历史记录
export const getHistory = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// 按时间段筛选历史记录
export const getHistoryByDateRange = (startDate, endDate) => {
  const history = getHistory();
  return history.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

// 清空历史记录
export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// 从表达式中提取使用的函数
const extractFunctions = (expression) => {
  const functions = [];
  const functionPatterns = [
    { name: 'sin', pattern: /sin\(/g },
    { name: 'cos', pattern: /cos\(/g },
    { name: 'tan', pattern: /tan\(/g },
    { name: 'log', pattern: /log\(/g },
    { name: 'ln', pattern: /Math\.log\(/g },
    { name: 'sqrt', pattern: /sqrt\(/g },
    { name: 'exp', pattern: /exp\(/g },
    { name: 'factorial', pattern: /!$/ },
    { name: 'power', pattern: /\^/g },
    { name: 'percentage', pattern: /%/g }
  ];
  
  functionPatterns.forEach(({ name, pattern }) => {
    if (pattern.test(expression)) {
      functions.push(name);
    }
  });
  
  return functions;
};

// 统计分析数据
export const analyzeHistory = (history = null) => {
  const records = history || getHistory();
  
  if (records.length === 0) {
    return {
      totalCalculations: 0,
      successRate: 0,
      functionsUsed: {},
      calculationFrequency: {},
      errorTypes: {},
      timeDistribution: {}
    };
  }
  
  const total = records.length;
  const successful = records.filter(r => !r.isError).length;
  const errors = records.filter(r => r.isError);
  
  // 统计常用函数
  const functionsUsed = {};
  records.forEach(record => {
    record.functionsUsed.forEach(func => {
      functionsUsed[func] = (functionsUsed[func] || 0) + 1;
    });
  });
  
  // 统计计算频率（按小时）
  const calculationFrequency = {};
  records.forEach(record => {
    const hour = new Date(record.timestamp).getHours();
    const hourKey = `${hour}:00-${hour + 1}:00`;
    calculationFrequency[hourKey] = (calculationFrequency[hourKey] || 0) + 1;
  });
  
  // 统计错误类型
  const errorTypes = {};
  errors.forEach(error => {
    const type = error.errorType || 'Unknown';
    errorTypes[type] = (errorTypes[type] || 0) + 1;
  });
  
  // 按日期分布
  const timeDistribution = {};
  records.forEach(record => {
    const date = new Date(record.timestamp).toISOString().split('T')[0];
    timeDistribution[date] = (timeDistribution[date] || 0) + 1;
  });
  
  return {
    totalCalculations: total,
    successRate: (successful / total * 100).toFixed(2),
    functionsUsed,
    calculationFrequency,
    errorTypes,
    timeDistribution
  };
};

// 生成分析报告数据
export const generateReport = (analysisData) => {
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCalculations: analysisData.totalCalculations,
      successRate: `${analysisData.successRate}%`,
      totalErrors: analysisData.totalCalculations - 
        Math.round(analysisData.totalCalculations * analysisData.successRate / 100)
    },
    topFunctions: Object.entries(analysisData.functionsUsed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    errorDistribution: analysisData.errorTypes,
    calculationFrequency: analysisData.calculationFrequency,
    timeDistribution: analysisData.timeDistribution
  };
};

// 导出为CSV格式
export const exportToCSV = (history) => {
  const headers = ['ID', '表达式', '结果', '是否错误', '错误类型', '时间戳', '使用的函数'];
  const rows = history.map(record => [
    record.id,
    record.expression,
    record.result,
    record.isError ? '是' : '否',
    record.errorType || '',
    record.timestamp,
    record.functionsUsed.join(', ')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// 导出为JSON格式
export const exportToJSON = (data) => {
  return JSON.stringify(data, null, 2);
};