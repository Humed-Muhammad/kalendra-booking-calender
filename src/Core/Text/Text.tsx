import styled from "styled-components";
import { fontSize, fontWeight, textAlign, variant } from "styled-system";
import type { TextProps } from "./types";
import { commonComposes } from "../common";

export const Text = styled("p")<TextProps>(
  (props: any) => ({
    color: props.color || props.theme.colors.text,
    //
    // Create a truncate implementation if props.truncate is true
    ...(props.truncate && {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    ...(props.truncateLines && {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: props.truncateLines,
      overflow: "hidden",
    }),
  }),
  variant({
    variants: {
      body1: {
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "24px",
      },
      body2: {
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "24px",
      },
      body3: {
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "24px",
      },
      body4: {
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "24px",
      },
      body5: {
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "24px",
      },
      body6: {
        fontWeight: 500,
        fontSize: "14px",

        color: "textGray",
      },
      heading1: {
        fontSize: ["26px", "26px", "30px", "30px", "36px", "36px"],
        fontWeight: 600,
        lineHeight:
          '["normal", "normal", "normal", "40px", "36px", "40px", "46px"]',
        maxWidth: "580px",
        width: "100%",
      },
      heading2: {
        fontSize: ["20px", "20px", "25px", "25px", "26px", "28px", "30px"],
        fontWeight: 600,
        lineHeight: ["normal"],
        maxWidth: "580px",
        width: "100%",
      },
      heading3: {
        fontSize: ["20px", "20px", "23px", "23px", "23px", "26px", "27px"],
        fontWeight: 600,
        lineHeight: ["normal"],
        maxWidth: "580px",
        width: "100%",
      },
      heading4: {
        fontSize: ["17px", "17px", "19px", "19px", "20px", "23px", "23px"],
        fontWeight: 600,
        lineHeight: ["normal"],
        maxWidth: "580px",
        width: "100%",
      },

      numberHolder: {
        color: "white",
        backgroundColor: "typePurpure.200",
        fontWeight: 600,
        fontSize: "14px",
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 0,
      },

      light: {
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "24px",
      },
      error: {
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "24px",
        color: "error",
      },
    },
  }),
  commonComposes([textAlign, fontWeight, fontSize])
);
