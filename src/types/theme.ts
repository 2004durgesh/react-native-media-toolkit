/**
 * Represents the theme for the video player.
 */
export interface Theme {
  /**
   * The colors used in the theme.
   */
  colors: {
    /**
     * The primary color.
     */
    primary: string;
    /**
     * The secondary color.
     */
    secondary: string;
    /**
     * The accent color.
     */
    accent: string;
    /**
     * The background color.
     */
    background: string;
    /**
     * The overlay color.
     */
    overlay: string;
    /**
     * The text color.
     */
    text: string;
    /**
     * The secondary text color.
     */
    textSecondary: string;
    /**
     * The error color.
     */
    error: string;
    /**
     * The success color.
     */
    success: string;
    /**
     * The border color.
     */
    border: string;
    /**
     * The focus color.
     */
    focus: string;
  };
  /**
   * The sizing values used in the theme.
   */
  sizing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /**
   * The icon sizes used in the theme.
   */
  iconSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  /**
   * The border radius used in the theme.
   */
  borderRadius: number;
  /**
   * The fonts used in the theme.
   */
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  /**
   * The font sizes used in the theme.
   */
  fontSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  /**
   * The animation durations used in the theme.
   */
  animations: {
    fast: number;
    normal: number;
    slow: number;
  };
}
