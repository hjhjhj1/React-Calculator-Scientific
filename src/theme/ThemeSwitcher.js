import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTheme } from './context';
import { IoMdColorPalette } from 'react-icons/io';

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, themes, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown show={isOpen} onToggle={(show) => setIsOpen(show)}>
      <Dropdown.Toggle 
        variant="outline-primary" 
        id="theme-dropdown"
        style={{
          backgroundColor: 'var(--color-button)',
          color: 'var(--color-buttonText)',
          borderColor: 'var(--color-border)',
          transition: 'var(--effect-transition)'
        }}
      >
        <IoMdColorPalette /> {themes[currentTheme].name}
      </Dropdown.Toggle>

      <Dropdown.Menu 
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)'
        }}
      >
        {availableThemes.map((themeKey) => (
          <Dropdown.Item 
            key={themeKey}
            onClick={() => setTheme(themeKey)}
            active={currentTheme === themeKey}
            style={{
              color: 'var(--color-foreground)',
              backgroundColor: currentTheme === themeKey ? 'var(--color-primary)' : 'transparent',
              transition: 'var(--effect-transition)'
            }}
          >
            {themes[themeKey].name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ThemeSwitcher;
