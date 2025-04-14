import styled from "styled-components";

export const Radio = styled.input.attrs({ type: "radio" })`
  appearance: none; /* Hide default checkbox */
  width: 18px;
  height: 18px;
  border: 1px solid #666;
  border-radius: 50px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:checked {
    background-color: ${(props: any) => props.theme.colors.dayBg};
    border-color: darkgray;
  }

  &:checked::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: white;
    opacity: 1;
  }
`;
