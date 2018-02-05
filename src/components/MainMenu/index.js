import React from 'react';
import PropTypes from 'prop-types';
import styled, {withTheme} from 'styled-components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import compose from 'recompose/compose';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
import views from 'Store/views';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import Overlay from '../Overlay';

const MenuPanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.menus.main.background};
  transition: all 0.1s ease;
  & > .toggle {
      flex: 0 0 24px;
      margin: 8px;
      &:hover {
        cursor: pointer;
      }
      }
  & > .item {
      flex: 0 0 24px;
      margin: 10px;
      img {
        width: 18px;
        height: 18px;
        opacity: ${props => props.theme.menus.main.icons.imageOpacity};
        &:hover {
          cursor: pointer;
        }
      }
    }
`;

const MainMenu = ({show = false, toggleMenu = () => {}, menu = [], theme, dataLoadRequest}) => {
  const addView = ({id = uuid.v4(), display = 'tab', type = 'table', items = [], ...rest}) =>
    dataLoadRequest({id, display, type, items, ...rest});

  const selectMenuItem = (event, item) => {
    event.preventDefault();
    const {action, url, title} = item;
    switch (action) {
      case 'ADD_GRID_VIEW':
        addView({
          name: title,
          data: url,
          type: 'grid',
        });
        break;

      case 'ADD_TABLE_VIEW':
        addView({
          name: title,
          data: url,
          type: 'table',
        });
        break;

      case 'ADD_PLUGIN_VIEW':
        addView({
          name: title,
          data: url,
          type: 'plugin',
        });
        break;

      default:
      // no default
    }
    toggleMenu(false);
  };

  const menuItems = menu.map(item => {
    return (
      <div className="item" key={item.id} onClick={event => selectMenuItem(event, item)}>
        <Tooltip content={item.title}><img src={item.icon} alt="" /></Tooltip>
      </div>
    );
  });

  const Menu = () => (
    <MenuPanel>
      <div className="toggle" onClick={() => toggleMenu(false)}>
        <Icon type="arrow-back" color={theme.menus.main.icons.color} />
      </div>
      {menuItems}
      <div className="item">
          <Link to="/test">
            <Tooltip content="Test Playground"><img src={'/assets/icons/white/share2.png'} alt="" /></Tooltip>
          </Link>
      </div>
    </MenuPanel>
  );

  return (
    <Overlay show={show} anyKey={true} onClose={() => toggleMenu(false)}>
      <Menu />
    </Overlay>
  );
};

MainMenu.propTypes = {
  show: PropTypes.bool,
  toggleMenu: PropTypes.func,
  menu: PropTypes.array,
  theme: PropTypes.object,
  dataLoadRequest: PropTypes.func,
};

const enhance = compose(
  connect(
    state => ({
      menu: state.config.menus,
    }),
    dispatch =>
      bindActionCreators(
        {
          dataLoadRequest: views.actions.dataLoadRequest,
        },
        dispatch
      )
  ),
  withTheme
);

export default enhance(MainMenu);
