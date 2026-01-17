const STORAGE_KEY = 'calculator_history';
const ERROR_TYPES = {
  SYNTAX_ERROR: 'SyntaxError',
  EVALUATION_ERROR: 'EvaluationError',
  INVALID_OPERAND: 'InvalidOperand',
  DIVISION_BY_ZERO: 'DivisionByZero',
  FACTORIAL_NEGATIVE: 'FactorialNegative',
  LOG_NEGATIVE: 'LogNegative',
  SQRT_NEGATIVE: 'SqrtNegative'
};
const FUNCTIONS_MAP = {
  'sqrt': '平方根',
  'sin': '正弦',
  'cos': '余弦',
  'tan': '正切',
  'log10': '常用对数',
  'ln': '自然对数',
  'exp': '指数',
  'factorial': '阶乘',
  'inversion': '倒数'
};
class HistoryManager {
  static getHistory() {
    try {
      const history = localStorage.getItem(STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }
  static saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }
  static addRecord(expression, result, error = null) {
    const history = this.getHistory();
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      expression: expression,
      result: result,
      error: error ? {
        type: error.type,
        message: error.message
      } : null,
      functionsUsed: this.extractFunctions(expression),
      operations: this.extractOperations(expression)
    };
    history.unshift(record);
    if (history.length > 1000) {
      history.pop();
    }
    this.saveHistory(history);
    return record;
  }
  static extractFunctions(expression) {
    const functions = [];
    const functionPatterns = [
      { regex: /sqrt\(/g, name: 'sqrt' },
      { regex: /sin\(/g, name: 'sin' },
      { regex: /cos\(/g, name: 'cos' },
      { regex: /tan\(/g, name: 'tan' },
      { regex: /log10\(/g, name: 'log10' },
      { regex: /ln\(/g, name: 'ln' },
      { regex: /exp\(/g, name: 'exp' },
      { regex: /factorial\(/g, name: 'factorial' },
      { regex: /1\//g, name: 'inversion' }
    ];
    functionPatterns.forEach(pattern => {
      const matches = expression.match(pattern.regex);
      if (matches) {
        functions.push(...Array(matches.length).fill(pattern.name));
      }
    });
    return functions;
  }
  static extractOperations(expression) {
    const operations = [];
    const operationPatterns = [
      { regex: /\+/g, name: '+' },
      { regex: /(?<!\d)-/g, name: '-' },
      { regex: /\*/g, name: '*' },
      { regex: /\//g, name: '/' },
      { regex: /%/g, name: '%' },
      { regex: /\^/g, name: '^' }
    ];
    operationPatterns.forEach(pattern => {
      const matches = expression.match(pattern.regex);
      if (matches) {
        operations.push(...Array(matches.length).fill(pattern.name));
      }
    });
    return operations;
  }
  static getRecordsByTimeRange(startDate, endDate) {
    const history = this.getHistory();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return history.filter(record => {
      const recordTime = new Date(record.timestamp).getTime();
      return recordTime >= start && recordTime <= end;
    });
  }
  static clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }
  static deleteRecord(id) {
    const history = this.getHistory();
    const filtered = history.filter(record => record.id !== id);
    this.saveHistory(filtered);
  }
  static getStatistics(records = null) {
    const history = records || this.getHistory();
    const totalCalculations = history.length;
    const successfulCalculations = history.filter(r => !r.error).length;
    const failedCalculations = history.filter(r => r.error).length;
    const errorRate = totalCalculations > 0 ? (failedCalculations / totalCalculations * 100).toFixed(2) : 0;
    const functionUsage = {};
    const operationUsage = {};
    const errorTypeDistribution = {};
    history.forEach(record => {
      if (record.functionsUsed) {
        record.functionsUsed.forEach(func => {
          functionUsage[func] = (functionUsage[func] || 0) + 1;
        });
      }
      if (record.operations) {
        record.operations.forEach(op => {
          operationUsage[op] = (operationUsage[op] || 0) + 1;
        });
      }
      if (record.error) {
        const errorType = record.error.type || 'Unknown';
        errorTypeDistribution[errorType] = (errorTypeDistribution[errorType] || 0) + 1;
      }
    });
    const mostUsedFunction = Object.entries(functionUsage).sort((a, b) => b[1] - a[1])[0] || null;
    const mostUsedOperation = Object.entries(operationUsage).sort((a, b) => b[1] - a[1])[0] || null;
    return {
      totalCalculations,
      successfulCalculations,
      failedCalculations,
      errorRate,
      functionUsage,
      operationUsage,
      errorTypeDistribution,
      mostUsedFunction,
      mostUsedOperation,
      averageCalculationsPerDay: this.getAveragePerDay(history),
      peakHour: this.getPeakHour(history)
    };
  }
  static getAveragePerDay(history) {
    if (history.length === 0) return 0;
    const dates = new Set();
    history.forEach(record => {
      const date = new Date(record.timestamp).toDateString();
      dates.add(date);
    });
    return (history.length / dates.size).toFixed(2);
  }
  static getPeakHour(history) {
    if (history.length === 0) return null;
    const hours = {};
    history.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });
    const peak = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
    return peak ? { hour: parseInt(peak[0]), count: peak[1] } : null;
  }
  static getCalculationsByHour(records = null) {
    const history = records || this.getHistory();
    const hourlyData = Array(24).fill(0);
    history.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      hourlyData[hour]++;
    });
    return hourlyData;
  }
  static getCalculationsByDay(records = null, days = 7) {
    const history = records || this.getHistory();
    const dailyData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const count = history.filter(record => {
        const recordDate = new Date(record.timestamp).toDateString();
        return recordDate === dateStr;
      }).length;
      dailyData.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        count: count
      });
    }
    return dailyData;
  }
  static getLocalizedFunctionName(funcName) {
    return FUNCTIONS_MAP[funcName] || funcName;
  }
  static getLocalizedErrorType(errorType) {
    const errorMap = {
      [ERROR_TYPES.SYNTAX_ERROR]: '语法错误',
      [ERROR_TYPES.EVALUATION_ERROR]: '计算错误',
      [ERROR_TYPES.INVALID_OPERAND]: '无效操作数',
      [ERROR_TYPES.DIVISION_BY_ZERO]: '除零错误',
      [ERROR_TYPES.FACTORIAL_NEGATIVE]: '负数阶乘',
      [ERROR_TYPES.LOG_NEGATIVE]: '对数负数',
      [ERROR_TYPES.SQRT_NEGATIVE]: '平方根负数'
    };
    return errorMap[errorType] || errorType;
  }
  static generateTestData(count = 50) {
    const testRecords = [];
    const functions = ['sqrt', 'sin', 'log10', 'ln', 'exp', 'factorial'];
    const operations = ['+', '-', '*', '/'];
    const errorTypes = Object.values(ERROR_TYPES);
    const now = Date.now();
    for (let i = 0; i < count; i++) {
      const isError = Math.random() < 0.15;
      const baseValue = Math.floor(Math.random() * 100) + 1;
      const secondValue = Math.floor(Math.random() * 50) + 1;
      const operation = operations[Math.floor(Math.random() * operations.length)];
      const expression = `${baseValue} ${operation} ${secondValue}`;
      const timestamp = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
      if (isError) {
        testRecords.push({
          id: now - i,
          timestamp: timestamp,
          expression: expression,
          result: null,
          error: {
            type: errorTypes[Math.floor(Math.random() * errorTypes.length)],
            message: 'Test error message'
          },
          functionsUsed: [],
          operations: [operation]
        });
      } else {
        const result = eval(expression);
        testRecords.push({
          id: now - i,
          timestamp: timestamp,
          expression: expression,
          result: result.toString(),
          error: null,
          functionsUsed: i % 3 === 0 ? [functions[Math.floor(Math.random() * functions.length)]] : [],
          operations: [operation]
        });
      }
    }
    const currentHistory = this.getHistory();
    this.saveHistory([...testRecords, ...currentHistory]);
    console.log(`Generated ${count} test records`);
  }
}
export { HistoryManager, ERROR_TYPES };
export default HistoryManager;
