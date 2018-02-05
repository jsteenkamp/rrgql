import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
// Note: contextmenu is a render prop version, index.js is a "HOC" version with config object
import ContextMenu, {
  Menu,
  Item,
} from 'Components/ContextMenu/contextmenu';
import Icon from 'Components/Icon';

const HeaderMenu = ({onSelect}) => (
  <Menu onClick={onSelect}>
    <Item
      item={{option: 1, task: 'hello world'}}
      onClick={event => console.info('item 1', event)}>
      <FormattedMessage
        id="views.Test.ContextMenu.Header.Item1"
        defaultMessage="Header Menu 1"
      />
    </Item>
    <Item item={2}>Header Menu 2</Item>
    <Item item={3}>Header Menu 3</Item>
    <Item item={4}>Header Menu 4</Item>
    <Item>
      <FormattedMessage
        id="views.Test.ContextMenu.Header.Item5"
        defaultMessage="Sub Menu 5"
      />
      <Menu >
        <Item item={{option: 51, task: 'hello world'}}>Sub Menu 51</Item>
        <Item item={52}>Sub Menu 52</Item>
      </Menu>
    </Item>
    <Item>
      <div><Icon type={'alarm'} /> Sub Menu 6...</div>
      <Menu>
        <Item item={{option: 61, task: 'hello world'}}>Sub Menu 61</Item>
        <Item item={62}>Sub Menu 62</Item>
        <Item>
          <Icon type={'alarm'} />
          <Menu>
            <Item item={{option: 71, task: 'hello world'}}>Sub Menu 71</Item>
            <Item item={72}>Sub Menu 72</Item>
            <Item item={73}>Sub Menu 73 (with long title...)</Item>
            <Item item={74}>Sub Menu 74</Item>
            <Item>
              Sub Menu 8...
              <Menu>
                <Item item={{option: 81, task: 'hello world'}}>
                  Sub Menu 81
                </Item>
                <Item item={82}>Sub Menu 82</Item>
                <Item item={83}>Sub Menu 83 (with long title...)</Item>
                <Item item={84}>Sub Menu 84</Item>
              </Menu>
            </Item>
          </Menu>
        </Item>
      </Menu>
    </Item>
    <Item item={6}>Menu 6 (with long title...)</Item>
    <Item>
      Sub Menu 5
      <Menu>
        <Item item={{option: 61, task: 'hello world'}}>Sub Menu 61</Item>
        <Item item={62}>Sub Menu 62</Item>
      </Menu>
    </Item>
    <Item item={7}>Menu 7</Item>
  </Menu>
);

HeaderMenu.propTypes = {
  onSelect: PropTypes.func,
};

const HeaderContextMenu = () => (
  <ContextMenu
    onSelect={item => console.info('onSelect CM', item)}
    render={() => (
      <HeaderMenu onSelect={item => console.info('onSelect', item)} />
    )}>
    <p style={{margin: '3em'}}>
      Right Click here for Context Menu. Resize browser to test expanded sub-menu positioning.
    </p>
  </ContextMenu>
);

export default injectIntl(HeaderContextMenu);
