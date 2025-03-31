import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import theme from '../../theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Create light and dark themes based on the base theme
  const lightTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'light',
    }
  });
  
  const darkTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      }
    }
  });
  
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};