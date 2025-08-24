import React, { createContext, useContext } from 'react';
import type { Theme } from 'src/types';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ theme, children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
