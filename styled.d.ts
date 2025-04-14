// Import the DefaultTheme from styled-components
import "styled-components";

// Extend the DefaultTheme interface
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      border: string;
      lightGray: string;
      text: string;
      headCell: string;
      dayHoverBg: string;
      dayHoverText: string;
      daySelectedBg: string;
      daySelectedText: string;
      dayDisabled: string;
      dayRangeMiddle: string;
      icon: string;
      transparent: string;
      dayBg: string;
      error: string;
    };
    // Add other theme properties if needed
  }
}
