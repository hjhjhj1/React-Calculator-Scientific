const STORAGE_KEY = 'calculator_history';

export const saveHistory = (entry) => {
  const history = getHistory();
  history.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = () => {
  const history = localStorage.getItem(STORAGE_KEY);
  return history ? JSON.parse(history) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const filterHistoryByDateRange = (startDate, endDate) => {
  const history = getHistory();
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(23, 59, 59, 999);
  
  return history.filter(entry => {
    const entryDate = new Date(entry.timestamp).getTime();
    return entryDate >= start && entryDate <= end;
  });
};
