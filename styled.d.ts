// The calendar's styled-components theme is the shape of lightTheme (darkTheme matches it).
import "styled-components";
import type { lightTheme } from "./src/theme";

type KalendraTheme = typeof lightTheme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends KalendraTheme {}
}
