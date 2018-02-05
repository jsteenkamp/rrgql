import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {numberToPixels, setOverflow} from 'Utils/components';
import _sumBy from 'lodash/sumBy';

const DRAGGER_SIZE = 7;

export const Dragger = styled.div`
  display: ${props => (props.show && props.resize ? 'block' : 'none')};
  flex: 0 0 ${DRAGGER_SIZE}px;
  pointer-events: ${props => (props.show && props.resize ? 'auto' : 'none')};
  cursor: ${props => (props.resize ? (props.direction === 'column' ? 'row-resize' : 'col-resize') : 'default')};
  background: ${props => props.theme.dragger.color};
  &.active, &:hover {
    background: ${props => props.theme.dragger.activeColor};
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: ${props => (props.show ? 'block' : 'none')};
  flex: 1 0 ${props => numberToPixels(props.size)};
  background: ${props => props.background};
  ${props => setOverflow(props.overflow)}
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

class Panels extends React.Component {
  state = {
    panels: [true, true],
  };

  dragElem = null;
  // panelElems = [top|left, bottom|right]
  panelElems = [null, null];
  panelSizes = [0, 0];
  lastPos = 0;
  maxSize = 0;

  // offsets are more performant than getBoundingClientRect[flexProperty]
  getSize = elem => (this.flex.property === 'width' ? elem.offsetWidth : elem.offsetHeight);

  onDragStart = event => {
    event.preventDefault();
    event.stopPropagation();
    this.lastPos = event[this.flex.event];
    this.dragElem = event.target;
    this.dragElem.classList.add('active');
    // calc max size available to selected panel by subtracting unselected panel
    const idx = this.dragElem.dataset.index === '0' ? 1 : 0;
    const totalDraggerSize = _sumBy(this.props.resizes, resize => (resize ? DRAGGER_SIZE : 0));
    this.maxSize =
      this.getSize(this.container) - this.getSize(this.panelElems[idx]) - totalDraggerSize;
    // disable events so if panel content is an iframe it does not swallow events
    this.panelElems.map(panel => (panel.style.pointerEvents = 'none'));
    window.addEventListener('mousemove', this.onDragMove, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
  };

  onDragMove = event => {
    event.preventDefault();
    event.stopPropagation();
    const pos = event[this.flex.event];
    const delta = pos - this.lastPos;
    if (this.dragElem.dataset.index === '0') {
      const size = this.getSize(this.panelElems[0]) + delta;
      if (size <= this.maxSize || delta < 0) this.panelElems[0].style.flexBasis = `${size}px`;
    } else {
      const size = this.getSize(this.panelElems[1]) - delta;
      if (size <= this.maxSize || delta > 0) this.panelElems[1].style.flexBasis = `${size}px`;
    }
    this.lastPos = pos;
  };

  onDragEnd = event => {
    event.preventDefault();
    event.stopPropagation();
    this.dragElem.classList.remove('active');
    if (this.props.show[0]) this.panelSizes[0] = this.getSize(this.panelElems[0]);
    if (this.props.show[1]) this.panelSizes[1] = this.getSize(this.panelElems[1]);
    // re-enable events
    this.panelElems.map(panel => (panel.style.pointerEvents = 'auto'));
    window.removeEventListener('mousemove', this.onDragMove, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
  };

  getPanelRefs = () => this.panelElems;

  componentWillReceiveProps(nextProps) {
    const containerSize = this.getSize(this.container);
    const totalPanelSize = this.panelSizes[0] + this.panelSizes[1];
    // resize panels proportionally when a panel was hidden and then shown after resize
    if (nextProps.show[0] && nextProps.show[1] && totalPanelSize > containerSize) {
      const scaleFactor = containerSize / totalPanelSize;
      this.panelSizes[0] = Math.round(this.panelSizes[0] * scaleFactor - DRAGGER_SIZE);
      this.panelSizes[1] = containerSize - this.panelSizes[0] - DRAGGER_SIZE;
      this.panelSizes.map((size, idx) => {
        this.panelElems[idx].style.flexBasis = `${size}px`;
      });
    }
  }

  render() {
    const {
      backgrounds,
      children,
      direction,
      height,
      overflows,
      panels,
      resizes,
      show,
      sizes,
      width,
    } = this.props;

    const showPanel = [show[0] && panels[0] !== null, show[1] && panels[1] !== null];

    // default layout is 'row'
    this.flex = {
      property: 'width',
      event: 'clientX',
    };

    // allow dynamically switching layout
    if (direction === 'column') {
      this.flex = {
        property: 'height',
        event: 'clientY',
      };
    }

    return (
      <div
        ref={ref => (this.container = ref)}
        style={{
          display: 'flex',
          flexDirection: direction,
          width: numberToPixels(width),
          height: numberToPixels(height),
          overflow: 'hidden',
        }}>
        <Wrapper
          innerRef={ref => (this.panelElems[0] = ref)}
          overflow={overflows[0]}
          background={backgrounds[0]}
          show={showPanel[0]}
          size={sizes[0]}>
          {showPanel[0] && panels[0]}
        </Wrapper>
        <Dragger
          data-index="0"
          direction={direction}
          onMouseDown={this.onDragStart}
          show={showPanel[0]}
          resize={resizes[0]}
        />
        {children}
        <Dragger
          data-index="1"
          direction={direction}
          onMouseDown={this.onDragStart}
          show={showPanel[1]}
          resize={resizes[1]}
        />
        <Wrapper
          innerRef={ref => (this.panelElems[1] = ref)}
          overflow={overflows[1]}
          background={backgrounds[1]}
          show={showPanel[1]}
          size={sizes[1]}>
          {showPanel[1] && panels[1]}
        </Wrapper>
      </div>
    );
  }
}

Panels.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  panels: PropTypes.array,
  sizes: PropTypes.array,
  resizes: PropTypes.array,
  backgrounds: PropTypes.array,
  overflows: PropTypes.array,
  show: PropTypes.array,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Panels.defaultProps = {
  children: null,
  direction: 'row',
  height: '100%',
  panels: [null, null],
  sizes: ['20%', '20%'],
  resizes: [true, true],
  backgrounds: ['transparent', 'transparent'],
  overflows: ['auto', 'auto'],
  show: [true, true],
  width: '100%',
  getRefs: () => {},
};

export default Panels;
