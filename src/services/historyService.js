const HISTORY_KEY = 'calculator_history';

export const historyService = {
  getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  },

  saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  addRecord(record) {
    const history = this.getHistory();
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...record
    };
    history.unshift(newRecord);
    if (history.length > 1000) {
      history.pop();
    }
    this.saveHistory(history);
    return newRecord;
  },

  clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  },

  getHistoryByDateRange(startDate, endDate) {
    const history = this.getHistory();
    return history.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= startDate && recordDate <= endDate;
    });
  },

  deleteRecord(id) {
    const history = this.getHistory();
    const filtered = history.filter(record => record.id !== id);
    this.saveHistory(filtered);
    return filtered;
  }
};
