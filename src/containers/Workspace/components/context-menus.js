import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
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
        id="containers.Workspace.ContextMenu.Header.Item1"
        defaultMessage="Header Menu 1"
      />
    </Item>
    <Item item={2}>Header Menu 2</Item>
    <Item item={3}>Header Menu 3</Item>
    <Item item={4}>Header Menu 4</Item>
    <Item>
      <FormattedMessage
        id="containers.Workspace.ContextMenu.Header.Item5"
        defaultMessage="Sub Menu 5"
      />
      <Menu onItemSelect={item => console.info('submenu', item)}>
        <Item item={{option: 51, task: 'hello world'}}>Sub Menu 51</Item>
        <Item item={52}>Sub Menu 52</Item>
      </Menu>
    </Item>
    <Item>
      <div><Icon type={'alarm'} /> Sub Menu 6...</div>
      <Menu onItemSelect={item => console.info('submenu', item)}>
        <Item item={{option: 61, task: 'hello world'}}>Sub Menu 61</Item>
        <Item item={62}>Sub Menu 62</Item>
        <Item>
          <Icon type={'alarm'} />
          <Menu onItemSelect={item => console.info('submenu', item)}>
            <Item item={{option: 71, task: 'hello world'}}>Sub Menu 71</Item>
            <Item item={72}>Sub Menu 72</Item>
            <Item item={73}>Sub Menu 73 (with long title...)</Item>
            <Item item={74}>Sub Menu 74</Item>
            <Item>
              Sub Menu 8...
              <Menu
                onItemSelect={item => console.info('submenu', item)}>
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
      <Menu onItemSelect={item => console.info('submenu', item)}>
        <Item item={{option: 61, task: 'hello world'}}>Sub Menu 61</Item>
        <Item item={62}>Sub Menu 62</Item>
      </Menu>
    </Item>
    <Item item={7}>Menu 7</Item>
  </Menu>
);

export const HeaderContextMenu = ({children}) => (
  <ContextMenu
    render={() => (
      <HeaderMenu onSelect={item => console.info('select', item)} />
    )}>
    {children}
  </ContextMenu>
);

const FooterMenu = ({onSelect}) => (
  <Menu onItemSelect={item => console.info('menu', item)}>
    <Item
      item={{option: 1, task: 'hello world'}}
      onClick={event => console.info('item 1', event)}>
      Footer Menu 1
    </Item>
    <Item item={2}>Footer Menu 2</Item>
    <Item item={3}>Footer Menu 3</Item>
    <Item item={4}>Footer Menu 4</Item>
    <Item item={5}>
      <div><Icon type={'alarm'} />Menu 5</div>
    </Item>
    <Item>
      <div><Icon type={'alarm'} /> Sub Menu 6...</div>
      <Menu onItemSelect={item => console.info('submenu', item)}>
        <Item item={{option: 61, task: 'hello world'}}>Sub Menu 61</Item>
        <Item item={62}>Sub Menu 62</Item>
        <Item>
          <Icon type={'alarm'} />
          <Menu onItemSelect={item => console.info('submenu', item)}>
            <Item item={{option: 71, task: 'hello world'}}>Sub Menu 71</Item>
            <Item item={72}>Sub Menu 72</Item>
            <Item item={73}>Sub Menu 73 (with long title...)</Item>
            <Item item={74}>Sub Menu 74</Item>
            <Item>
              Sub Menu 8...
              <Menu
                onItemSelect={item => console.info('submenu', item)}>
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
    <Item item={7}>Menu 7</Item>
  </Menu>
);

export const FooterContextMenu = ({children}) => (
  <ContextMenu
    render={() => (
      <FooterMenu onSelect={item => console.info('select', item)} />
    )}>
    {children}
  </ContextMenu>
);