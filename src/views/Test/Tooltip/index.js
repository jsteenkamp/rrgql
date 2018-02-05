import React from 'react';
import styled from 'styled-components';
import Tooltip, {tooltip} from 'Components/Tooltip';
import Icon from 'Components/Icon';

const Content = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: 150px;
  height: 150px;
  margin: 10px;
  padding: 10px;
  background: lightgreen;
`;

Content.defaultProps = {
  top: 0,
  left: 0,
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

// Use React components in tooltips via the tooltip() HOC
const Test = () => (
  <div>
    <h1>Content wrapping Tooltip</h1>
    <p>You can also use React components inside tooltips using the tooltip HOC</p>
    <div><Icon type="alarm" color="white" size={64} /></div>
    <p>
      Lots and lots of text to make this tooltip wrap and grow
      {' '}
      <strong>very very very very very very</strong>
      {' '}
      large to test viewport positioning...
    </p>
  </div>
);
const TestTooltip = tooltip(Test);

const TooltipDemo = () => {
  return (
    <Wrapper>
      <Content>
        <div>Hover over icon</div>
        <TestTooltip>
          <Icon type="alarm" size="36px" />
        </TestTooltip>
      </Content>
      <Content top={'90%'} left={'80%'}>
        <TestTooltip>
          Automatic tooltip positioning
        </TestTooltip>
      </Content>
      <Content top={'30%'} left={'20%'}>
        <TestTooltip>
          The tooltip is centered with respect to the content it wraps, so this tooltip may be off-center with respect to the box
        </TestTooltip>
      </Content>
      <Tooltip content={'<p>Tooltip parent is the layout wrapper so it does not appear above the Box as expected. This is down to the layout design.</p>'}>
        <Content top={'50%'} left={'60%'}>
          Hover over Box
        </Content>
      </Tooltip>
    </Wrapper>
  );
};

export default TooltipDemo;
