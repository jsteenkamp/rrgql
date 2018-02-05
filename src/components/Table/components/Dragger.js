import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import config from '../config';

const Divider = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  cursor: col-resize;
  width: ${config.draggerWidth}px;
  height: ${props => props.height}px;
  border-right: 1px solid ${props => props.theme.table.borderColor};
  &:hover {
    border-color: ${props => props.theme.table.activeBorderColor};
  }
`;

class Dragger extends React.Component {
  dragger = {isDragging: false};

  onDragStart = ({event, column}) => {
    event.preventDefault();
    this.dragger = {
      isDragging: true,
      column,
      target: event.target,
      start: event.clientX,
      end: event.clientX,
      offset: event.target.offsetLeft - event.clientX,
    };
    window.addEventListener('mousemove', this.onDragMove, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
  };

  onDragMove = event => {
    event.preventDefault();
    if (this.dragger.isDragging) {
      const pos = event.clientX;
      const newWidth = this.props.width - (this.dragger.start - pos);
      if (newWidth < this.props.maxWidth && newWidth > this.props.minWidth) {
        this.dragger.target.style.left = `${this.dragger.offset + pos}px`;
        this.dragger.end = pos;
      }
    }
  };

  onDragEnd = event => {
    event.preventDefault();
    if (this.dragger.isDragging) {
      const delta = this.dragger.start - this.dragger.end;
      this.props.onColumnResize({column: this.dragger.column, delta});
      window.removeEventListener('mousemove', this.onDragMove, false);
      window.removeEventListener('mouseup', this.onDragEnd, false);
      this.dragger.isDragging = false;
    }
  };

  render() {
    const {height, column} = this.props;
    return (
      <Divider
        height={height}
        onMouseDown={event => this.onDragStart({event, column})}
      />
    );
  }
}

Dragger.propTypes = {
  width: PropTypes.number,
  onColumnResize: PropTypes.func,
  column: PropTypes.string,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  height: PropTypes.number,
};

export default Dragger;
