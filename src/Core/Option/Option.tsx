import styled from "styled-components";
import { CommonProps } from "../common/types";
import { commonComposes } from "../common";

export const Option = styled.option<CommonProps>`
  ${commonComposes()}
`;
