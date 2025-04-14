import { ReactNode } from "react";
import styled from "styled-components";

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div`
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

const TooltipContainer = styled.div`
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

interface Props {
  text: string;
  children: ReactNode;
}
export const Tooltip = ({ text, children }: Props) => {
  return (
    <TooltipWrapper>
      <TooltipContainer>
        {children}
        <TooltipText>{text}</TooltipText>
      </TooltipContainer>
    </TooltipWrapper>
  );
};
