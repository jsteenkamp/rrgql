import React from 'react';
import styled from 'styled-components';

// create a spinning box with one missing side
const Spinner = styled.div`
  &:not(:required) {
    width: 24px;
    height: 24px;
    border: 2px solid ${props => props.theme.spinner.color};
    border-radius: 12px;
    border-right-color: transparent;
    animation: spinner 1125ms infinite linear;
  }
  
  @keyframes spinner {
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
  }
`;

export default Spinner;