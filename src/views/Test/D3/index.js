import React from 'react';
import styled from 'styled-components';
import {
  scaleLinear,
  range,
  forceSimulation,
  select,
  selectAll,
  forceX,
  forceY,
  forceManyBody,
  forceLink,
} from 'd3';
import _times from 'lodash/times';

const Wrapper = styled.div`
     width: 100%;
     height: 100%; 
     background: lightyellow;
     canvas {
        position: absolute;
      }
      svg {
        position: absolute;
      }
      path.country {
        fill: #C4B9AC;
        stroke-width: 1;
        stroke: #4F442B;
        opacity: .5;
      }
      path.sample {
        stroke: #41A368;
        stroke-width: 1px;
        fill: #93C464;
        fill-opacity: .5;
      }
      line.link {
        stroke-width: 1px;
        stroke: #4F442B;
        stroke-opacity: .5;
      }
      circle.node {
        fill: #93C464;
        stroke: #EBD8C1;
        stroke-width: 1px;
      }
      circle.xy {
        fill: #FCBC34;
        stroke: #FE9922;
        stroke-width: 1px;
      }
`;

class Diagram extends React.Component {
  canvasSize = 720;
  aspect = 1;

  wrapperRef = null;
  canvasRef = null;
  svgRef = null;

  sampleNodes = [];
  sampleLinks = [];

  // get width of container and resize svg to fit it
  resize = () => {
    // get container + svg aspect ratio
    const container = select(this.wrapperRef);
    const svg = select(this.svgRef);
    const canvas = select(this.canvasRef);
    const width = parseInt(container.style('width'));
    const height = Math.round(width / this.aspect);
    svg.style('width', `${width}px`).style('height', `${height}px`);
    canvas.attr('width', width).attr('height', height);
    this.canvasSize = width;
  };

  linkScale = scaleLinear().domain([0, 0.9, 0.95, 1]).range([0, 10, 100, 300]);

  forceTick = () => {
    if (this.canvasRef !== null) {
      const context = this.canvasRef.getContext('2d');
      context.clearRect(0, 0, this.canvasSize, this.canvasSize);
      context.lineWidth = 1;
      context.strokeStyle = 'rgba(0, 0, 0, 0.5)';

      this.sampleLinks.forEach(link => {
        context.beginPath();
        context.moveTo(link.source.x, link.source.y);
        context.lineTo(link.target.x, link.target.y);
        context.stroke();
      });

      selectAll('circle.node').attr('cx', d => d.x).attr('cy', d => d.y);
    }
  };

  createForceDiagram = () => {
    forceSimulation()
      .nodes(this.sampleNodes)
      .force('x', forceX(this.canvasSize / 2).strength(0.5))
      .force('y', forceY(this.canvasSize / 2).strength(0.5))
      .force('charge', forceManyBody())
      .force('link', forceLink())
      .on('tick', this.forceTick)
      .force('link')
      .links(this.sampleLinks);

    select(this.svgRef)
      .selectAll('circle.node')
      .data(this.sampleNodes)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('class', 'node');

    //this.resize();
  };

  generateNodes = () => {
    this.sampleNodes = range(3000).map(d => ({id: 'Sample Node ' + d}));
    this.sampleLinks.length = 0;
    _times(2000, () => {
      const randomSource = Math.floor(Math.random() * 3000);
      const randomTarget = Math.floor(this.linkScale(Math.random()));
      const linkObject = {
        source: this.sampleNodes[randomSource],
        target: this.sampleNodes[randomTarget],
      };
      if (randomSource !== randomTarget) {
        this.sampleLinks.push(linkObject);
      }
    });
  };

  componentWillMount() {
    this.generateNodes();
  }

  componentDidMount() {
    const svg = select(this.svgRef);
    const width = parseInt(svg.style('width'));
    const height = parseInt(svg.style('height'));
    this.aspect = width / height;
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('perserveAspectRatio', 'xMinYMid');
    this.createForceDiagram();
    window.addEventListener('resize', this.resize, false);
  }

  componentDidUpdate() {
    this.createForceDiagram();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize, false);
  }

  render() {
    return (
      <Wrapper innerRef={ref => (this.wrapperRef = ref)}>
        <canvas
          ref={ref => (this.canvasRef = ref)}
          height={this.canvasSize}
          width={this.canvasSize}
        />
        <svg
          ref={ref => (this.svgRef = ref)}
          style={{height: `${this.canvasSize}px`, width: `${this.canvasSize}px`}}
        />
      </Wrapper>
    );
  }
}

export default Diagram;
