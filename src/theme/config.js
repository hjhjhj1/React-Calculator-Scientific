export const themes = {
  light: {
    name: '浅色模式',
    colors: {
      background: 'rgb(205, 224, 247)',
      foreground: '#000000',
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      button: '#007bff',
      buttonText: '#ffffff',
      buttonHover: '#0056b3',
      border: '#000000',
      inputBackground: '#ffffff',
      inputColor: '#007bff',
      inputBorder: '#007bff'
    },
    fonts: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      size: '16px',
      sizeSmall: '14px',
      sizeLarge: '18px',
      weight: 'normal',
      weightBold: 'bold'
    },
    spacing: {
      buttonPadding: '0px',
      containerMargin: '60px',
      inputWidth: '380px',
      inputHeight: '100px',
      inputMarginBottom: '5px',
      borderWidth: '2px',
      borderRadius: '4px'
    },
    effects: {
      boxShadow: 'none',
      borderStyle: 'inset',
      transition: 'all 0.3s ease'
    }
  },
  dark: {
    name: '深色模式',
    colors: {
      background: '#1a1a2e',
      foreground: '#ffffff',
      primary: '#4ecca3',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      button: '#16213e',
      buttonText: '#4ecca3',
      buttonHover: '#0f3460',
      border: '#4ecca3',
      inputBackground: '#16213e',
      inputColor: '#4ecca3',
      inputBorder: '#4ecca3'
    },
    fonts: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      size: '16px',
      sizeSmall: '14px',
      sizeLarge: '18px',
      weight: 'normal',
      weightBold: 'bold'
    },
    spacing: {
      buttonPadding: '0px',
      containerMargin: '60px',
      inputWidth: '380px',
      inputHeight: '100px',
      inputMarginBottom: '5px',
      borderWidth: '2px',
      borderRadius: '4px'
    },
    effects: {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      borderStyle: 'solid',
      transition: 'all 0.3s ease'
    }
  },
  highContrast: {
    name: '高对比度护眼模式',
    colors: {
      background: '#1e1e1e',
      foreground: '#ffff00',
      primary: '#00ff00',
      secondary: '#6c757d',
      success: '#00ff00',
      danger: '#ff0000',
      warning: '#ffff00',
      info: '#00ffff',
      light: '#ffffff',
      dark: '#000000',
      button: '#000000',
      buttonText: '#ffff00',
      buttonHover: '#333333',
      border: '#ffff00',
      inputBackground: '#000000',
      inputColor: '#ffff00',
      inputBorder: '#ffff00'
    },
    fonts: {
      family: '"Arial Black", "Helvetica Neue", sans-serif',
      size: '18px',
      sizeSmall: '16px',
      sizeLarge: '20px',
      weight: 'bold',
      weightBold: '900'
    },
    spacing: {
      buttonPadding: '5px',
      containerMargin: '60px',
      inputWidth: '380px',
      inputHeight: '100px',
      inputMarginBottom: '5px',
      borderWidth: '3px',
      borderRadius: '0px'
    },
    effects: {
      boxShadow: 'none',
      borderStyle: 'solid',
      transition: 'all 0.2s ease'
    }
  },
  engineering: {
    name: '工程模式',
    colors: {
      background: '#f5f5dc',
      foreground: '#2f4f4f',
      primary: '#556b2f',
      secondary: '#6c757d',
      success: '#228b22',
      danger: '#8b0000',
      warning: '#daa520',
      info: '#4682b4',
      light: '#faf0e6',
      dark: '#2f4f4f',
      button: '#deb887',
      buttonText: '#2f4f4f',
      buttonHover: '#d2b48c',
      border: '#2f4f4f',
      inputBackground: '#faf0e6',
      inputColor: '#556b2f',
      inputBorder: '#556b2f'
    },
    fonts: {
      family: '"Courier New", Courier, monospace',
      size: '15px',
      sizeSmall: '13px',
      sizeLarge: '17px',
      weight: 'normal',
      weightBold: 'bold'
    },
    spacing: {
      buttonPadding: '2px',
      containerMargin: '60px',
      inputWidth: '380px',
      inputHeight: '100px',
      inputMarginBottom: '5px',
      borderWidth: '2px',
      borderRadius: '0px'
    },
    effects: {
      boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)',
      borderStyle: 'solid',
      transition: 'all 0.2s ease'
    }
  },
  minimal: {
    name: '极简模式',
    colors: {
      background: '#ffffff',
      foreground: '#333333',
      primary: '#333333',
      secondary: '#999999',
      success: '#333333',
      danger: '#333333',
      warning: '#333333',
      info: '#333333',
      light: '#ffffff',
      dark: '#333333',
      button: '#f5f5f5',
      buttonText: '#333333',
      buttonHover: '#e5e5e5',
      border: '#e0e0e0',
      inputBackground: '#ffffff',
      inputColor: '#333333',
      inputBorder: '#e0e0e0'
    },
    fonts: {
      family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      size: '14px',
      sizeSmall: '12px',
      sizeLarge: '16px',
      weight: '300',
      weightBold: '500'
    },
    spacing: {
      buttonPadding: '0px',
      containerMargin: '80px',
      inputWidth: '380px',
      inputHeight: '100px',
      inputMarginBottom: '10px',
      borderWidth: '1px',
      borderRadius: '8px'
    },
    effects: {
      boxShadow: 'none',
      borderStyle: 'solid',
      transition: 'all 0.4s ease'
    }
  },
  cyberpunk: {
    name: '赛博朋克模式',
    colors: {
      background: '#0d0221',
      foreground: '#00ff9f',
      primary: '#ff00ff',
      secondary: '#6c757d',
      success: '#00ff9f',
      danger: '#ff0055',
      warning: '#ffff00',
      info: '#00ffff',
      light: '#1a1a2e',
      dark: '#0d0221',
      button: '#1a1a2e',
      buttonText: '#00ff9f',
      buttonHover: '#2a2a4e',
      border: '#ff00ff',
      inputBackground: '#1a1a2e',
      inputColor: '#00ff9f',
      inputBorder: '#ff00ff'
    },
    fonts: {
      family: '"Orbitron", "Arial Black", sans-serif',
      size: '16px',
      sizeSmall: '14px',
      sizeLarge: '18px',
      weight: 'normal',
      weightBold: 'bold'
    },
    spacing: {
      buttonPadding: '0px',
      containerMargin: '60px',
      inputWidth: '380px',
      inputHeight: '100px',
      inputMarginBottom: '5px',
      borderWidth: '2px',
      borderRadius: '0px'
    },
    effects: {
      boxShadow: '0 0 10px #ff00ff, 0 0 20px #00ff9f',
      borderStyle: 'solid',
      transition: 'all 0.3s ease'
    }
  }
};

export const defaultTheme = 'light';
