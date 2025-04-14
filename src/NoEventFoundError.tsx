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

const Container = styled.div`
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff5f5, #fff0f6);
  padding: 24px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  animation: fadeIn 0.3s ease-in;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  background-color: #fff1f0;
  padding: 16px;
  border-radius: 50%;
  margin: 0 auto 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #d32029;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #595959;
  line-height: 1.5;
  margin-bottom: 24px;
`;

export const EventTypeError = () => (
  <Container>
    <Card>
      <IconWrapper>
        <AlertTriangle size={40} color="#d32029" />
      </IconWrapper>
      <Title>Event Type Not Found</Title>
      <Message>
        We couldn't locate the event type you were trying to access. It might be
        deleted or the link may be incorrect.
      </Message>
      {/* <ContactButton href="mailto:admin@yoursite.com">Contact Site Owner</ContactButton> */}
      <Message>Please contact the site owner for assistance.</Message>
    </Card>
  </Container>
);
