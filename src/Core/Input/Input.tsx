import styled from "styled-components";
import { CommonProps } from "../common/types";
import { commonComposes } from "../common";

export const Input = styled("input")<CommonProps>`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => (props.color as string) || props.theme.colors.text};
  border-radius: 8px;
  border: 1px solid;
  border-color: ${(props) => props.theme.colors.border};
  outline: none;
  padding: 8px;
  font-size: 14px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "auto")};
  &:focus {
    border-color: ${(props) => props.theme.colors.text};
  }
  ${commonComposes()};
`;
