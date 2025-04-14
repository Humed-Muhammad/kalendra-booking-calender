// LoadingDots.tsx
import styled, { keyframes } from "styled-components";

// Keyframes for the blinking effect
const blink = keyframes`
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
`;

const DotsContainer = styled.span`
  display: inline-flex;
  align-items: center;
`;

const Dot = styled.span<{ color: string }>`
  animation-name: ${blink};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  margin: 0 1px;
  background-color: ${({ color }) => color};

  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
`;

interface LoadingDotsProps {
  color?: string;
}

const LoadingDots = ({ color = "#000" }: LoadingDotsProps) => {
  return (
    <DotsContainer>
      <Dot color={color} />
      <Dot color={color} />
      <Dot color={color} />
    </DotsContainer>
  );
};

export default LoadingDots;
