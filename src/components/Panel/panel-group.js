import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import {numberToPixels} from 'Utils/components';

// do not allow dragging to zero size
const minimumSize = 1;
const draggerSize = 5;

const Dragger = styled.div`
  display: ${props => (props.show ? 'flex' : 'none')};
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: ${draggerSize}px;
  cursor: ${props => (props.direction === 'column' ? 'row-resize' : 'col-resize')};
  background: ${props => props.theme.dragger.color};
  &.active {
    background: ${props => props.theme.dragger.activeColor};
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: ${props => (props.show ? 'flex' : 'none')};
  flex-direction: ${props => props.direction};
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: ${props => (props.direction === 'column' ? numberToPixels(props.height) : numberToPixels(props.width))};
  overflow: hidden;
  background: ${props => props.background};
`;

Wrapper.propTypes = {
  direction: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  show: PropTypes.bool,
  background: PropTypes.string,
};

Wrapper.defaultProps = {
  direction: 'column',
  width: '100%',
  height: '100%',
  show: true,
  background: 'transparent',
};

class PanelGroup extends React.Component {
  groupWrapperRect = {width: 0, height: 0, top: 0, left: 0};
  groupWrapperSize = 0;
  resizeIndex = 0;
  flexWrappers = [];
  flexSizes = [];
  lastPos = 0;
  resizeProperty = 'left';
  flexProperty = 'width';
  eventProperty = 'clientX';
  hasResized = false;
  dragElem = null;

  init = ({width, height, top, left}) => {
    // always recalc wrapper size
    if (this.props.direction === 'column') {
      this.resizeProperty = 'top';
      this.flexProperty = 'height';
      this.eventProperty = 'clientY';
    }
    this.groupWrapperRect = {width, height, top, left};
    this.groupWrapperSize = this.groupWrapperRect[this.flexProperty];
    // if resized do not reset to original sizes
    if (!this.hasResized) {
      // calc initial sizing if passed by children
      let total = 0;
      const unsized = [];
      const flexRatios = [];
      // can only set initial size as % since we do not know px size if wrapper hidden
      React.Children.forEach(this.props.children, (child, idx) => {
        if (React.isValidElement(child)) {
          const size = child.props[this.flexProperty];
          // set initial panel size if specified
          if (size === undefined || size === '100%') {
            unsized.push(idx);
          } else {
            flexRatios[idx] = typeof size === 'string'
              ? parseFloat(size) / 100
              : size / this.groupWrapperSize;
            total += flexRatios[idx];
          }
          // distribute remaining space amongst unsized panels
          if (unsized.length) {
            const remainder = 1 - total;
            if (remainder > 0) {
              const proportion = remainder / unsized.length;
              unsized.map(idx => (flexRatios[idx] = proportion));
            }
          }
        }
      });
      // set initial sizing
      this.flexWrappers.forEach((ref, idx) => {
        if (flexRatios.length) {
          const ratio = flexRatios[idx] * 100;
          ref.style.cssText = `flex-shrink: 1; flex-grow: 1; flex-basis: ${ratio}%;`;
        }
      });
      this.props.onResize(this.flexWrappers);
    }
  };

  onDragStart = event => {
    event.preventDefault();
    this.lastPos = event[this.eventProperty];
    // the drag element is associated with specific panel
    this.dragElem = event.target;
    this.dragElem.classList.add('active');
    this.resizeIndex = parseInt(this.dragElem.dataset.index, 10);
    this.groupWrapperSize = this.groupWrapperRect[this.flexProperty];
    // get sizes for proportional resizing
    this.flexSizes.length = 0;
    // disable events so if panel content is an iframe it does not swallow events
    this.flexWrappers.forEach((ref, idx) => {
      const size = ref.getBoundingClientRect()[this.flexProperty];
      this.flexSizes.push(size);
      if (idx !== 0) {
        ref.style.cssText = `flex-shrink: 0; flex-basis: ${size}px; pointer-events: none;`;
      }
    });
    window.addEventListener('mousemove', this.onDragMove, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
  };

  onDragMove = event => {
    event.preventDefault();
    const pos = event[this.eventProperty];
    const flexSize = this.flexWrappers[0].getBoundingClientRect()[this.flexProperty];
    // only allow resize if flex space available and no smaller than minimumSize
    if (flexSize !== 0 || pos > this.lastPos) {
      if (this.props.proportional) {
        let resizeSize = 0;
        let minSizeCount = 0;
        const rects = this.flexWrappers.map((ref, idx) => {
          const size = ref.getBoundingClientRect()[this.flexProperty];
          if (idx > this.resizeIndex && size <= minimumSize) minSizeCount++;
          if (idx === this.resizeIndex) resizeSize = size;
          return size;
        });

        // distribute size across resizing panel and non-zero size siblings after
        const delta =
          (pos - this.lastPos) / (this.flexWrappers.length - this.resizeIndex - minSizeCount);

        if (resizeSize - delta >= minimumSize) {
          this.flexWrappers.map((ref, idx) => {
            if (idx === this.resizeIndex - 1) {
              ref.style.cssText = `flex-shrink: 1; flex-grow: 1; pointer-events: none;`;
            } else if (idx >= this.resizeIndex) {
              const size = rects[idx] - delta;
              if (size >= minimumSize) {
                ref.style.cssText = `flex-shrink: 0; flex-basis: ${size}px; pointer-events: none;`;
              } else {
                ref.style.cssText = `flex-shrink: 0; flex-grow: 0; flex-basis: 0; pointer-events: none;`;
              }
            } else {
              const size = this.flexSizes[idx] / this.groupWrapperSize * 100;
              ref.style.cssText = `flex-shrink: 0; flex-grow: 0; flex-basis: ${size}%; pointer-events: none;`;
            }
          });
          this.lastPos = pos;
        }
      } else {
        const size =
          this.flexWrappers[this.resizeIndex].getBoundingClientRect()[this.flexProperty] -
          (pos - this.lastPos);
        if (size > minimumSize) {
          this.flexWrappers[
            this.resizeIndex
          ].style.cssText = `flex-shrink: 0; flex-basis: ${size}px; pointer-events: none;`;
          this.lastPos = pos;
        }
      }
    }
  };

  onDragEnd = event => {
    event.preventDefault();
    this.hasResized = true;
    this.dragElem.classList.remove('active');
    this.dragElem = null;
    // calc panel ratios for proportional resizing, re-enable events
    this.flexWrappers.forEach(ref => {
      const size = ref.getBoundingClientRect()[this.flexProperty] / this.groupWrapperSize * 100;
      //ref.style.cssText = `flex-grow: 1; flex-shrink: 1; flex-basis: ${size}%; pointer-events: unset;`;
      ref.style.flexBasis = `${size}%`;
      ref.style.pointerEvents = 'auto';
    });
    // resize returns the panel refs (elements) - no point returning getBoundingClientRect as panel may be hidden
    this.props.onResize(this.flexWrappers);
    window.removeEventListener('mousemove', this.onDragMove, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
  };

  flexPanels = ({children, direction, show}) => {
    const panels = [];
    this.flexWrappers.length = 0;
    React.Children.forEach(children, (child, idx) => {
      if (React.isValidElement(child)) {
        if (idx !== 0) {
          panels.push(
            <Dragger
              key={`drag-${idx}`}
              direction={direction}
              onMouseDown={this.onDragStart}
              show={show[idx] === undefined ? true : show[idx]}
              data-index={idx}
            />
          );
        }
        // size wrapper to child and let child grow to fill wrapper
        const childClone = React.cloneElement(child, {
          width: '100%',
          height: '100%',
        });
        panels.push(
          <Wrapper
            innerRef={ref => {
              if (ref !== null) {
                this.flexWrappers.push(ref);
              }
            }}
            key={`flex-${idx}`}
            direction={direction}
            width={child.props.width}
            height={child.props.height}
            show={show[idx] === undefined ? true : show[idx]}>
            {childClone}
          </Wrapper>
        );
      }
    });
    return panels;
  };

  render() {
    return (
      <Measure bounds>
        {({measureRef, contentRect}) => {
          this.init(contentRect.bounds);
          return (
            <Wrapper
              innerRef={measureRef}
              direction={this.props.direction}
              background={this.props.background}
              onResize={this.props.onResize}>
              {this.flexPanels(this.props)}
            </Wrapper>
          );
        }}
      </Measure>
    );
  }
}

PanelGroup.propTypes = {
  direction: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  show: PropTypes.array,
  children: PropTypes.array,
  onResize: PropTypes.func,
  proportional: PropTypes.bool,
  background: PropTypes.string,
};

PanelGroup.defaultProps = {
  direction: 'row',
  width: '100%',
  height: '100%',
  show: [],
  children: [],
  onResize: () => {},
  proportional: true,
  background: 'transparent',
};

export default PanelGroup;
