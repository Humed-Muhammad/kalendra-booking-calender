import styled from "styled-components";
import { CommonProps } from "../common/types";
import { commonComposes } from "../common";

export const Select = styled.select<CommonProps>`
  ${commonComposes()}
`;
