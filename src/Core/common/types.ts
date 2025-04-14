import type { CSSObject } from "styled-components/dist/types";
import type {
  BorderProps,
  BoxShadowProps,
  ColorProps,
  FlexBasisProps,
  FlexboxProps,
  FlexDirectionProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
  ZIndexProps,
} from "styled-system";

export interface CommonProps
  extends SpaceProps,
    LayoutProps,
    FlexboxProps,
    ColorProps,
    BorderProps,
    PositionProps,
    TypographyProps,
    ZIndexProps,
    FlexBasisProps,
    FlexDirectionProps,
    BoxShadowProps {
  gap?: Array<string | number> | string | number;
  _hover?: CSSObject | undefined;
  cursor?: Array<CursorType> | CursorType | undefined;
  direction?: Array<Direction> | Direction | undefined;
  textDecoration?:
    | Array<CSSObject["textDecoration"]>
    | CSSObject["textDecoration"]
  | undefined;
  selected?: boolean;
}

export type Direction =
  | "ltr"
  | "rtl"
  | "inherit"
  | "initial"
  | "revert"
  | "unset";

type CursorType =
  | "pointer"
  | "default"
  | "wait"
  | "text"
  | "move"
  | "not-allowed"
  | "none"
  | "context-menu"
  | "help"
  | "progress"
  | "cell"
  | "crosshair"
  | "vertical-text"
  | "alias"
  | "copy"
  | "no-drop"
  | "grab"
  | "grabbing"
  | "all-scroll"
  | "col-resize"
  | "row-resize"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize"
  | "ne-resize"
  | "nw-resize"
  | "se-resize"
  | "sw-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "zoom-in"
  | "zoom-out"
  | "grabbing"
  | "initial"
  | "inherit";
