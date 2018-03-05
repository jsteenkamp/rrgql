import React from 'react';
import styled, {css, ThemeProvider} from 'styled-components';
import theme from 'styled-theming';
import {darken} from 'polished';
import {
  space,
  width,
  fontSize,
  color,
  textAlign,
  boxShadow,
  flex,
  flexDirection,
  flexWrap,
} from 'styled-system';

// import Panel from 'Components/Panel';

const boxColors = theme('mode', {
  light: props =>
    css`
      background: ${props.theme.colors.primary1};
      color: black;
      font-family: sans-serif;
    `,
  dark: props =>
    css`
      background: ${props.theme.colors.primary2};
      color: white;
      font-family: serif;
    `,
});

const buttonColors = theme.variants('mode', 'variant', {
  default: {
    light: props => css`
      background: ${props.theme.colors.primary2};
      color: white;
      &:hover {
        background: ${darken(0.2, props.theme.colors.primary2)};
      }
    `,
    dark: props => css`
      background: ${props.theme.colors.primary1};
      color: black;
       &:hover {
        background: ${darken(0.2, props.theme.colors.primary1)};
      }
    `,
  },
  active: {
    light: props => css`
      background: ${props.theme.colors.primary1};
      color: black;
       &:hover {
        background: ${darken(0.2, props.theme.colors.primary1)};
      }
    `,
    dark: props => css`
      background: ${props.theme.colors.primary2};
      color: white;
       &:hover {
        background: ${darken(0.2, props.theme.colors.primary2)};
      }
    `,
  }
});

// Add styled-system functions to your component
const Container = styled.div`
  display: flex;
  ${space};
  ${width};
  ${flex};
  ${flexDirection};
`;

const Box = styled.div`
  h1 {
    margin: .5em 0;
  };
  ${fontSize};
  ${space};
  ${width};
  ${textAlign};
  ${boxShadow};
  ${boxColors};
`;

const Button = styled.button`
  margin: 10px;
  padding: 5px;
  border: 2px solid ${props => darken(0.6, props.theme.colors.primary1)};
  ${buttonColors};
`;

const Component = () => {
  return (
    <Container flexDirection={'row'} width={1}>
      <ThemeProvider theme={{mode: 'light'}}>
        <Box
          m={[1, 2, 3]}
          p={[1, 2, 3]}
          width={[1, 1 / 2, 1 / 4]}
          fontSize={[1, 2, 3]}
          boxShadow={'shadow6dp'}
          color={'primary3'}>
          <h1>Box 1 - Light Theme</h1>
          <p>
            Each style function exposes its own set of props /that style elements based on values
            defined in a theme. Some props allow an array value to be passed to set styles
            responsively per-breakpoint.
          </p>
          <p><Button variant="active">Button 1</Button><Button variant="default">Button 2</Button></p>
        </Box>
      </ThemeProvider>
      <ThemeProvider theme={{mode: 'dark'}}>
        <Box m={[1, 2, 3]} p={[1, 2, 3]} width={1} fontSize={[1, 2, 3]} boxShadow={'shadow6dp'}>
          <h1>Box 2 - Dark Theme</h1>
          <p>
            Each style function exposes its own set of props that style elements based on values
            defined in a theme. Some props allow an array value to be passed to set styles
            responsively per-breakpoint.
          </p>
          <p><Button variant="active">Button 1</Button><Button variant="default">Button 2</Button></p>
        </Box>
      </ThemeProvider>
    </Container>
  );
};

export default Component;
