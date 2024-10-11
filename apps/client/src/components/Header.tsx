import { Flex } from "antd";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.section`
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
  padding: 0 24px;
  border-shadow: 0 2px 8px #f0f0f0;
`;

interface Props {
  logo: React.ReactNode;
}

export const Header: React.FC<Props> = ({ logo }) => {
  return (
    <Wrapper>
      <Flex className="header">{logo}</Flex>
    </Wrapper>
  );
};
