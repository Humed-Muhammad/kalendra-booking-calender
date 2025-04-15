import styled, { keyframes } from "styled-components";
import { AlertTriangle } from "lucide-react";

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  height: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at top left, #1a1a1a, #0d0d0d);
  padding: 32px;
`;

const Card = styled.div`
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const IconWrapper = styled.div`
  background-color: rgba(211, 32, 41, 0.1);
  padding: 20px;
  border-radius: 50%;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #ff4d4f;
`;

const Divider = styled.div`
  width: 60%;
  height: 1px;
  background: linear-gradient(to right, #ff4d4f, transparent);
  margin: 8px 0;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #bfbfbf;
  line-height: 1.6;
`;

export const EventTypeError = () => (
  <Container>
    <Card>
      <IconWrapper>
        <AlertTriangle size={40} color="#ff4d4f" />
      </IconWrapper>
      <Title>Event Type Not Found</Title>
      <Divider />
      <Message>
        Sorry, we couldn't locate the event type you're looking for. It might
        have been deleted or the link is broken.
      </Message>
      <Message>Try checking the link or contact the site owner.</Message>
      <Message>Contact website owner for support</Message>
    </Card>
  </Container>
);
