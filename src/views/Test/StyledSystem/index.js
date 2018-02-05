import React from 'react';
import styled from 'styled-components';
import {space, width, fontSize, color, textAlign, boxShadow, flex, flexDirection, flexWrap} from 'styled-system';
// import Panel from 'Components/Panel';

// Add styled-system functions to your component
const Container = styled.div`
  display: flex;
  ${space};
  ${width};
  ${flex};
  ${flexDirection};
`;

const Box = styled.div`
  ${space};
  ${width};
  ${fontSize};
  ${color};
  ${textAlign};
  ${boxShadow};
  background: ${props => props.theme.colors.primary1};
`;

const Component = () => {
  return (
    <Container flexDirection={'row'} width={1}>
      <Box m={[1, 2, 3]} p={[1, 2, 3]} width={[1, 1 / 2, 1/4]} fontSize={[1, 2, 3]} boxShadow={'shadow6dp'} color={'primary3'}>
        Box 1. Each style function exposes its own set of props /that style elements based on values defined in a theme. Some props allow an array value to be passed to set styles responsively per-breakpoint.
      </Box>
      <Box m={[1, 2, 3]} p={[1, 2, 3]} width={1} fontSize={[1, 2, 3]} boxShadow={'shadow6dp'}>
        Box 2. Each style function exposes its own set of props that style elements based on values defined in a theme. Some props allow an array value to be passed to set styles responsively per-breakpoint.
      </Box>
    </Container>
  );
};

export default Component;
