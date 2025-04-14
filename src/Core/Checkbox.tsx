import styled from "styled-components";

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none; /* Hide default checkbox */
  width: 18px;
  height: 18px;
  border: 1px solid #666;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  cursor: ${(props: any) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props: any) => (props.disabled ? 0.5 : 1)};

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
