import React from 'react';
import styled from 'styled-components';

/* if you want to add a shadow...
  box-shadow: ${props => props.theme.filterPanel.shadow};
  margin: 0 0 15px 15px;
 */

export const Wrapper = styled.div`
  box-shadow: ${props => props.theme.filterPanel.optionsOverlay.shadow};
  border: 1px solid ${props => props.theme.filterPanel.optionsOverlay.borderColor};
  margin: 5px 5px 10px 10px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & .panel-header {
    flex: 0 0 auto;
    height: 40px;
    padding: 8px;
    background: ${props => props.theme.filterPanel.headerBackgroundColor};
    & .find-input-wrapper {
      position: relative;
      input {
        width: calc(100% - 10px);
        height: 24px;
        border: none;
        line-height: 24px;
        font-size: .875em;
        padding: 0 5px;
        color: ${props => props.theme.filterPanel.inputTextColor};
      }
      .find-clear {
        position: absolute;
        right: 5px;
        top: 5px;
        color: ${props => props.theme.filterPanel.inputTextColor};
        font-size: .875em;
        display: none;
        &.show {
          display: block;
          cursor: pointer;
        }
      }
    }
  }

  & .panel-content {
    flex: 0 1 auto;
    overflow-y: auto;
    max-height: calc(${props => props.height}px - 80px);
    padding: 0 16px;
    background: ${props => props.theme.filterPanel.contentBackgroundColor};
    .table {
      width: 100%;
      thead {
        tr:hover {
          background: none;
        }
        th {
          font-size: .875em;
          font-weight: 500;
          text-align: left;
          padding: 5px 0;
        }
      }
      tbody {
        td { 
          padding: 5px 0;   
          border-top: 1px solid #eee;
        }
        td:first-child { 
          vertical-align: top;
          & label {
            white-space: nowrap;
          }
        }
      }
    }
    input[type="checkbox"] {
      color: ${props => props.theme.filterPanel.inputTextColor};
    }
    input[type="checkbox"].some-checked {
      opacity: .5;
    }
  }

  & .panel-footer {
    height: 40px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 8px 16px;
    background: ${props => props.theme.filterPanel.footerBackgroundColor};;
    .footer-item {
      flex: 0 0 auto;
      margin-left: 16px;
    }
  }
`;

export default Wrapper;
