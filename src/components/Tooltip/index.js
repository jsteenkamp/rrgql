import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import _debounce from 'lodash/debounce';

const tooltipSpacing = 20;

const Wrapper = styled.div`
  position: absolute;
  width: 220px;
  padding: 10px;
  margin: ${tooltipSpacing}px 0;
  border-radius: 5px;
  box-sizing: border-box;
  z-index: 1000;
  color: ${props => props.theme.tooltip.color};
  background: ${props => props.theme.tooltip.background}; 
  box-shadow: ${props => props.theme.tooltip.shadow}; 
`;

// tooltip is bounded by full viewport (could use #root selector)
const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

class Tooltip extends React.Component {
  static defaultProps = {
    children: null,
    style: {},
    theme: {},
    content: '',
    wrappedContent: () => {},
  };

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    theme: PropTypes.object,
    content: PropTypes.string,
    wrappedContent: PropTypes.func,
  };

  state = {
    show: false,
  };

  parentElem = null;
  // check if mouse is still over tooltip element (handle delayed display)
  tooltipShow = false;

  setPosition = ({width, height}) => {
    const position = {top: 0, left: 0, height};
    if (this.parentElem) {
      const viewport = getViewport();
      const parentRect = this.parentElem.getBoundingClientRect();
      // reference position is center of parent element
      const parentCenter = {
        top: parentRect.top + parentRect.height / 2,
        left: parentRect.left + parentRect.width / 2,
      };
      // vertical positioning (not catering for tooltip initial position above parent)
      if (parentRect.top + height + 2 * tooltipSpacing > viewport.height) {
        position.top = `${parentCenter.top - height - 2 * tooltipSpacing}px`;
      } else {
        position.top = `${parentCenter.top}px`;
      }
      // horizontal positioning (default centers tooltip relative to parent)
      const toolTipCenter = width / 2;
      if (toolTipCenter > parentCenter.left) {
        position.left = 0;
      } else if (parentCenter.left + toolTipCenter > viewport.width) {
        position.left = `${viewport.width - width}px`;
      } else {
        position.left = `${parentCenter.left - toolTipCenter}px`;
      }
    }
    return position;
  };

  debounced = _debounce(() => {
    if (this.tooltipShow) {
      this.setState(() => ({show: this.tooltipShow}));
    }
  }, 300);

  clearTooltip = () => {
    this.tooltipShow = false;
    this.debounced.cancel();
    if (this.state.show) {
      this.setState(() => ({show: this.tooltipShow}));
    }
  };

  showTooltip = () => {
    this.tooltipShow = true;
    this.debounced();
  };

  // pass content using __html object key for dangerous setting
  createMarkup = content => ({__html: content});

  componentWillReceiveProps() {
    this.setState(() => ({show: false}));
  }

  componentWillUnmount() {
    // clean up debounce delays setState() call and we cannot setState on unmounted component
    this.debounced.cancel();
  }

  render() {
    // prefer mouse Enter/Leave to Over/Out but does not work in lame MSIE 11
    return (
      <div
        style={{display: 'inline', cursor: 'pointer'}}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.clearTooltip}
        ref={ref => (this.parentElem = ref)}>
        {this.props.children}
        {this.state.show &&
          ReactDOM.createPortal(
            <Measure bounds>
              {({measureRef, contentRect}) => {
                const position = this.setPosition(contentRect.bounds);
                // use visibility so tooltip not visible when repositioning during measure
                const visibility = contentRect.bounds.height === undefined ? 'hidden' : 'visible';
                return this.props.content
                  ? <Wrapper
                      innerRef={measureRef}
                      style={{top: position.top, left: position.left, visibility}}
                      dangerouslySetInnerHTML={this.createMarkup(this.props.content)}
                    />
                  : <Wrapper
                      innerRef={measureRef}
                      style={{top: position.top, left: position.left, visibility}}>
                      {this.props.wrappedContent()}
                    </Wrapper>;
              }}
            </Measure>,
            document.getElementById('portal')
          )}
      </div>
    );
  }
}

export default Tooltip;

// tooltip HOC
export const tooltip = WrappedContent => props => (
  <Tooltip wrappedContent={WrappedContent}>{props.children}</Tooltip>
);
