import React from 'react';
import styled from 'styled-components';
import {Tabs, TabPanel} from 'Components/Tabs';
// test scrolling - PanelLayout switches from vertical (column) to horizontal (row) layout when clicked
import PanelLayout from '../PanelLayout';

const HeaderPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  background: white;
  border-bottom: 1px solid #f2f2f2;
  & > div {
    margin: 5px;
    line-height: 40px;
  }
`;

// can add selected={true} to panel

const Test = () => {
  return (
    <Tabs
      bottom={false}
      onRemove={tab => console.info('remove', tab)}
      onSelect={props => console.info('onSelect', props)}
      hasIcon={true}>
      <TabPanel name={'Tab 1'} viewType={'grid'} background={'#f4f4f4'}>
        {false && <HeaderPanel>
          <div>Panel 1</div>
        </HeaderPanel>}
        <Tabs
          bottom={true}
          onRemove={tab => console.info('remove', tab)}
          onSelect={props => console.info('onSelect', props)}
          hasIcon={true}>
          <TabPanel name={'Tab 1-1'} viewType={'1'} background={'#f4f4f4'}>
            <HeaderPanel>
              <div>Panel 1-1</div>
            </HeaderPanel>
            <PanelLayout/>
          </TabPanel>
          <TabPanel name={'Tab 1-2'} viewType={'2'} background={'#e4f4f4'}>
            <HeaderPanel>
              <div>Panel 1-2</div>
            </HeaderPanel>
            <PanelLayout/>
          </TabPanel>
          <TabPanel name={'Tab 1-3'} viewType={'3'} background={'#f4e4f4'}>
            <HeaderPanel>
              <div>Panel 1-3</div>
            </HeaderPanel>
          </TabPanel>
          <TabPanel name={'Tab 1-4'} viewType={'4'} background={'#f4f4e4'}>
            <HeaderPanel>
              <div>Panel 1-4</div>
            </HeaderPanel>
          </TabPanel>
        </Tabs>
      </TabPanel>
      <TabPanel name={'Tab 2'} viewType={'2'} background={'#e4f4f4'}>
        <HeaderPanel>
          <div>Panel 2</div>
        </HeaderPanel>
        <PanelLayout/>
      </TabPanel>
      <TabPanel name={'Tab 3'} viewType={'table'} background={'#f4e4f4'}>
        <HeaderPanel>
          <div>Panel 3</div>
        </HeaderPanel>
        <PanelLayout/>
      </TabPanel>
      <TabPanel name={'Tab 4'} viewType={'undefined'} background={'#f4f4e4'}>
        <HeaderPanel>
          <div>Panel 4</div>
        </HeaderPanel>
      </TabPanel>
      <TabPanel name={'Tab 5'} viewType={'table'} background={'#f4f4f4'}>
        <HeaderPanel>
          <div>Panel 5</div>
        </HeaderPanel>
      </TabPanel>
      <TabPanel name={'Tab 6'} viewType={'grid'} background={'#e4f4e4'}>
        <HeaderPanel>
          <div>Panel 6</div>
        </HeaderPanel>
      </TabPanel>
    </Tabs>
  );
};

export default Test;
