import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _compose from 'lodash/fp/compose'; // alias for flowRight
import _map from 'lodash/fp/map';
import _get from 'lodash/fp/get';
import Icon from 'Components/Icon';
import Panel from 'Components/Panel';

// icon data
const icons = [
  { id: 1, type: 'alarm', size: 48, color: 'white' },
  { id: 2, type: '3d_rotation', size: '1.75rem', color: 'black' },
  { id: 3, type: 'bookmark' },
  { id: 4, type: 'alarm', size: '4vw', color: 'black' },
  { id: 5, type: '3d_rotation', size: '6vw' },
  { id: 6, type: 'bookmark', size: '8vw', color: 'white' },
  { id: 7, type: 'home', size: 48, color: 'black' },
  { id: 8, type: 'home', size: 24, color: 'white' },
  { id: 9, type: 'home', size: 12, color: 'black' },
];

const Wrapper = children => <Panel>{children}</Panel>;

Wrapper.propTypes = {
  children: PropTypes.func.isRequired,
};

const Ul = styled.ul`
  width: calc(100% - 80px);
  height: calc(100% - 80px);
  background: lightgreen;
  box-shadow: ${props => props.theme.shadows.shadow24dp};
  li {
    margin: 10px;
  }
`;

const List = children => <Ul>{children}</Ul>;

List.propTypes = {
  children: PropTypes.func.isRequired,
};

// We need this wrapper to provide a unique rendering key
const ListItem = ({ id, type, size, color }) => (
  <li key={id}>
    <Icon type={type} size={size} color={color} />
  </li>
);

ListItem.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
};

// FaC component composition
const Icons = _compose(Wrapper, List, _map(ListItem), _get('icons'));

// make it so...
export default () => <Icons icons={icons} />;
