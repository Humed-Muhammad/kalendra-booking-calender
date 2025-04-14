// components/Avatar.tsx
import React from "react";
import styled from "styled-components";

const AvatarContainer = styled.div`
  position: relative;
  display: inline-flex;
  height: 40px;
  width: 40px;
  overflow: hidden;
  border-radius: 9999px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #6b7280;
`;

const AvatarImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 14px;
`;

interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  src?: string;
  fallback?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  alt,
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <AvatarContainer {...props}>
      {src && !imgError ? (
        <AvatarImage src={src} alt={alt} onError={() => setImgError(true)} />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </AvatarContainer>
  );
};
