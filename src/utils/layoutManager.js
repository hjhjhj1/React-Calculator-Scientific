const LAYOUT_STORAGE_KEY = 'calculator_layout';

export const defaultButtons = [
  { id: 'btn-7', label: '7', name: '7', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-8', label: '8', name: '8', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-9', label: '9', name: '9', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-divide', label: '/', name: '/', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-4', label: '4', name: '4', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-5', label: '5', name: '5', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-6', label: '6', name: '6', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-minus', label: '-', name: '-', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-1', label: '1', name: '1', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-2', label: '2', name: '2', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-3', label: '3', name: '3', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-plus', label: '+', name: '+', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-0', label: '0', name: '0', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-dot', label: '.', name: '.', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-equals', label: '=', name: '=', action: 'calculate', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-multiply', label: '×', name: '*', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-clear', label: 'AC', name: 'AC', action: 'clear', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-del', label: '⌫', name: 'del', action: 'del', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-percent', label: '%', name: '%', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-sin', label: 'Sin', name: 'sin', action: 'sin', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-cos', label: 'Cos', name: 'cos', action: 'cos', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-tan', label: 'Tan', name: 'tan', action: 'tan', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-sqrt', label: '√', name: 'sqrt', action: 'squareroot', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-inv', label: '1/x', name: '1/x', action: 'inversion', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-fact', label: 'x!', name: 'x!', action: 'factorial', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-ln', label: 'ln', name: 'ln', action: 'numberLog', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-log', label: 'log', name: 'log', action: 'numberLog10', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-pi', label: 'π', name: '3.141592653589793', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-e', label: 'e', name: '2.718281828459045', action: 'exponent', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-open-paren', label: '(', name: '(', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-close-paren', label: ')', name: ')', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-power', label: '^', name: '**', action: 'handleClick', size: 'normal', variant: 'outline-primary' },
  { id: 'btn-square', label: 'x²', name: '**2', action: 'handleClick', size: 'normal', variant: 'outline-primary' }
];

export const loadLayout = () => {
  try {
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (savedLayout) {
      return JSON.parse(savedLayout);
    }
  } catch (error) {
    console.error('Error loading layout from localStorage:', error);
  }
  return defaultButtons;
};

export const saveLayout = (buttons) => {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(buttons));
    return true;
  } catch (error) {
    console.error('Error saving layout to localStorage:', error);
    return false;
  }
};

export const resetLayout = () => {
  saveLayout(defaultButtons);
  return defaultButtons;
};
