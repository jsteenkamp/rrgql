import React from 'react';
import {Accordion, AccordionPanel} from 'Components/Accordion';

// can add selected={true} to panel

const Test = () => {
  return (
    <Accordion
      onRemove={tab => console.info('remove', tab)}
      onSelect={props => console.info('onSelect', props)}
      hasIcon={true}>
      <AccordionPanel name={'Accordion 1'} viewType={'grid'} background={'#f4f4f4'}>
        <h1>Panel 1</h1>
      </AccordionPanel>
      <AccordionPanel name={'Accordion 2'} viewType={'2'} background={'#e4f4f4'}>
        <h1>Panel 2</h1>
      </AccordionPanel>
      <AccordionPanel name={'Accordion 3'} viewType={'table'} background={'#f4e4f4'}>
        <h1>Panel 3</h1>
      </AccordionPanel>
      <AccordionPanel name={'Accordion 4'} viewType={'undefined'} background={'#f4f4e4'}>
        <h1>Panel 4</h1>
      </AccordionPanel>
    </Accordion>
  );
};

export default Test;
