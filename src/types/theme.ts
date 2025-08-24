export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    overlay: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    border: string;
    focus: string;
  };
  sizing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  iconSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  borderRadius: number;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  animations: {
    fast: number;
    normal: number;
    slow: number;
  };
}
