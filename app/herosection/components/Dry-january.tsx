// components/Dry-january.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

const StyledSection = styled.section`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow: hidden;
  background: #fff;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled(Link)`
  display: block;
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafafa;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 1;
`;

const TextContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 2;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Tag = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  color: #333;
  z-index: 2;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DryJanuary: React.FC = () => {
  return (
    <StyledSection>
      <ContentWrapper href="/sdnblog/35961">
        <ImageContainer>
          <Image
            src="/campaign/Dryjan.jpg"
            alt="Dry January Campaign 2024"
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <Overlay />
          <Tag>Dry January 2024</Tag>
          <TextContent>
            <Title>DRY JANUARY</Title>
            <Subtitle>มกราคมนี้ งดเหล้า ดีต่อใจ ดีต่อสุขภาพ!</Subtitle>
          </TextContent>
        </ImageContainer>
      </ContentWrapper>
    </StyledSection>
  );
};

export default DryJanuary;