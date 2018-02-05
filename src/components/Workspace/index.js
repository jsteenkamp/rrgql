import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {setOverflow} from 'Utils/components';
import Panels from './panels';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.background};
  ${props => setOverflow(props.overflow)}
`;

class Workspace extends React.Component {
  state = {
    panels: this.props.panels.map(panel => {
      if (panel === null) return false;
      return panel.show === undefined ? true : panel.show;
    }),
  };

  // get workspace DOM ref
  getWorkspaceRef = () => this.workspaceElem;

  // get workspace panel DOM refs (uses Panel getPanelRefs API)
  getPanelRefs = () => {
    const outer = this.outerPanelRef.getPanelRefs();
    const inner = this.innerPanelRef.getPanelRefs();
    // return refs in TRBL order
    return this.props.direction === 'horizontal'
      ? [outer[0], inner[1], outer[1], inner[0]]
      : [inner[0], outer[1], inner[1], outer[0]];
  };

  // if setting value === null then retain current state value
  showPanels = show =>
    this.setState(({panels}) => ({panels: show.map((s, i) => (s === null ? panels[i] : s))}));

  togglePanel = panelIndex => {
    this.setState(({panels}) => ({
      panels: panels.map(
        (show, idx) => (this.props.panels[idx] === null ? false : idx === panelIndex ? !show : show)
      ),
    }));
  };

  render() {
    const {direction, background, overflow, width, height} = this.props;
    // panel order is clockwise TRBL: top, right, bottom, left (same as in CSS)
    let layout = {
      direction: ['column', 'row'],
      order: [0, 2, 3, 1],
    };
    // reorder panels for vertical layout
    if (direction === 'vertical') {
      layout = {
        direction: ['row', 'column'],
        order: [3, 1, 0, 2],
      };
    }

    const panels = layout.order.map(idx => ({
      resize: true,
      size: '20%',
      overflow: 'auto',
      ...this.props.panels[idx],
      show: this.state.panels[idx],
    }));

    return (
      <Panels
        ref={ref => (this.outerPanelRef = ref)}
        width={width}
        height={height}
        direction={layout.direction[0]}
        panels={[panels[0].panel, panels[1].panel]}
        sizes={[panels[0].size, panels[1].size]}
        resizes={[panels[0].resize, panels[1].resize]}
        overflows={[panels[0].overflow, panels[1].overflow]}
        backgrounds={[panels[0].background, panels[1].background]}
        show={[panels[0].show, panels[1].show]}>
        <Panels
          ref={ref => (this.innerPanelRef = ref)}
          direction={layout.direction[1]}
          panels={[panels[2].panel, panels[3].panel]}
          sizes={[panels[2].size, panels[3].size]}
          resizes={[panels[2].resize, panels[3].resize]}
          overflows={[panels[2].overflow, panels[3].overflow]}
          backgrounds={[panels[2].background, panels[3].background]}
          show={[panels[2].show, panels[3].show]}>
          <Wrapper
            background={background}
            overflow={overflow}
            innerRef={ref => (this.workspaceElem = ref)}>
            {this.props.children({
              togglePanel: this.togglePanel,
              showPanels: this.showPanels,
              getWorkspaceRef: this.getWorkspaceRef,
              getPanelRefs: this.getPanelRefs,
            })}
          </Wrapper>
        </Panels>
      </Panels>
    );
  }
}

Workspace.propTypes = {
  background: PropTypes.string,
  backgrounds: PropTypes.array,
  children: PropTypes.func,
  direction: PropTypes.string,
  overflow: PropTypes.string,
  panels: PropTypes.array,
  show: PropTypes.array,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Workspace.defaultProps = {
  background: 'transparent',
  backgrounds: ['transparent', 'transparent', 'transparent', 'transparent'],
  children: () => {},
  direction: 'horizontal',
  overflow: 'auto',
  panels: [null, null, null, null],
  show: [true, true, true, true],
  height: '100%',
  width: '100%',
};

export default Workspace;
