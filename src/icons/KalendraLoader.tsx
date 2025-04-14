// KalendraLoader.tsx
import { Box } from "src/Core";
import styled, { keyframes } from "styled-components";

const l9_0 = keyframes`
  0% {
    background-position: 0 100%, 100% 100%, 100% 0;
  }
  33% {
    background-position: 100% 100%, 100% 100%, 100% 0;
  }
  66% {
    background-position: 100% 0, 100% 0, 100% 0;
  }
`;

const l9_0_0 = keyframes`
  0% {
    transform: scaleX(1) rotate(0deg);
  }
  50% {
    transform: scaleX(-1) rotate(-90deg);
  }
`;

const l9_1 = keyframes`
  16.5% {
    transform: perspective(150px) rotateX(-90deg) rotateY(0deg) rotateX(0deg);
    filter: grayscale(0.8);
  }
  33% {
    transform: perspective(150px) rotateX(-180deg) rotateY(0deg) rotateX(0deg);
  }
  66% {
    transform: perspective(150px) rotateX(-180deg) rotateY(-180deg) rotateX(0deg);
  }
  100% {
    transform: perspective(150px) rotateX(-180deg) rotateY(-180deg) rotateX(-180deg);
    filter: grayscale(0.8);
  }
`;

const Loader = styled(Box)`
  width: 60px;
  aspect-ratio: 1;
  display: grid;
  grid: 50% / 50%;
  color: ${({ theme }: any) => theme.colors.rootLoaderColor ?? "#ffa516"};
  border-radius: 50%;
  --_g: no-repeat linear-gradient(currentColor 0 0);
  background: var(--_g), var(--_g), var(--_g);
  background-size: 50.1% 50.1%;
  animation: ${l9_0} 1.5s infinite steps(1) alternate,
    ${l9_0_0} 3s infinite steps(1) alternate;

  &::before {
    content: "";
    background: currentColor;
    border-top-left-radius: 100px;
    transform: perspective(150px) rotateY(0deg) rotateX(0deg);
    transform-origin: bottom right;
    animation: ${l9_1} 1.5s infinite linear alternate;
  }
`;

export const KalendraLoader = () => {
  return <Loader />;
};
