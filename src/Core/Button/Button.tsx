import styled from "styled-components";
import { CommonProps } from "../common/types";
import { commonComposes } from "../common";

export const Button = styled("button")<CommonProps>`
  border: ${(props) => "1px solid " + props.theme.colors.border};
  color: ${(props) => (props.color as string) || props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 4px;
  border-radius: 8px;
  padding-right: 12px;
  padding-left: 12px;
  background: ${(props) =>
    props.selected ? props.theme.colors.dayBg : `none`};
  //   min-width: 80px;
  &:hover {
    ${(props) => props._hover};
  }

  ${commonComposes()}
`;
