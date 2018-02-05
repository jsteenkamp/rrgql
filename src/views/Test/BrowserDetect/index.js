import React from 'react';
import styled from 'styled-components';
import bowser from 'bowser';

const List = styled.ul`
  list-style-type: circle;
  list-style-position: inside;
  & > li {
    display: list-item;
    padding: 2px 0;
  }
`;

export default () => {
  console.info('bowser', bowser);
  return (
    <div style={{margin: '3em'}}>
      <h1>Your Browser</h1>
      <List>
        <li>{bowser.name}</li>
        <li>{bowser.version}</li>
      </List>
      <p>Check console log "bowser" (not a typo) for more details...</p>
    </div>
  );
};
