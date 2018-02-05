import styled from 'styled-components';
import {numberToPixels} from 'Utils/components';

export const TabBar = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  height: ${props => numberToPixels(props.height)};
  background: ${props => props.theme.tabs.backgroundColor};
`;

export const Tab = styled.div`
  display: flex;
  flex-direction: row;
  flex: auto;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  box-sizing: border-box;
  height: 100%;
  border: 1px solid ${props => props.theme.tabs.borderColor};
  border-bottom: 1px solid ${props => (props.selected ? props.theme.tabs.selectedBackgroundColor : props.theme.tabs.borderColor)};
  &:not(:first-child) {
    border-left: 1px solid transparent;
  }
  background: ${props => (props.selected ? props.theme.tabs.selectedBackgroundColor : props.theme.tabs.backgroundColor)};
  &:hover {
    background: ${props => (props.selected ? props.theme.tabs.selectedBackgroundColor : props.theme.tabs.hoverBackgroundColor)};
  }
  & > .icon {
    flex: none;
    width: 24px;
    height: 24px;
    margin: 0 10px;
    background: ${props => props.theme.tabs.icon.backgroundColor[props.viewType] || props.theme.tabs.icon.backgroundColor.default};
    line-height: 24px;
    text-align: center;
    text-transform: uppercase;
    color: ${props => props.theme.tabs.icon.color};
    font-size: 18px;
  }
  & > .name {
    color: ${props => (props.selected ? props.theme.tabs.selectedColor : props.theme.tabs.color)};
    flex: auto;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  & > .close {
    flex: none;      
    width: 18px;
    height: 18px;
    line-height: 18px;
    margin: 0 10px;
    visibility: hidden;
    font-weight: normal;
    text-align: center;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      border-radius: 50%;
      color: ${props => props.theme.tabs.close.color};
      background: ${props => props.theme.tabs.close.backgroundColor};
    }
  }
  &:hover > .close {
    visibility: visible;
  }
`;

export const TabOptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  border: 1px solid ${props => props.theme.tabs.borderColor};
  border-left: none;
  background: ${props => props.theme.tabs.backgroundColor};
   & > div {
    flex: none;
    min-width: 32px;
    height: 24px;
    margin: 0 10px;
    padding: 0 4px;
    background: white;
    line-height: 24px;
    text-align: center;
    text-transform: uppercase;
    color: #999;
    font-size: 18px;
    &:hover {
      color: #222;
    }
  }
`;

export const TabOptionsOverlay = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.tabs.optionsOverlay.shadow};
  margin: 10px;
  & > ${Tab} {
    border: 1px solid ${props => props.theme.tabs.borderColor}; 
    border-bottom: none;
    & > .icon {
      margin-left: 0;
    }
    & > .close {
      margin-right: 0;
    }
  }
`;
