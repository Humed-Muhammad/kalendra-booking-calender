import styled from "styled-components";
import { CommonProps } from "../common/types";
import { commonComposes } from "../common";

export const Input = styled("input")<CommonProps>`
  background: ${(props: any) => props.theme.colors.background};
  color: ${(props: any) => props.color || props.theme.colors.text};
  border-radius: 8px;
  border: 1px solid;
  border-color: ${(props: any) => props.theme.colors.border};
  outline: none;
  padding: 8px;
  font-size: 14px;
  opacity: ${(props: any) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props: any) => (props.disabled ? "not-allowed" : "auto")};
  &:focus {
    border-color: ${(props: any) => props.theme.colors.text};
  }
  ${commonComposes()};
`;
