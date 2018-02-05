import React from 'react';
import styled from 'styled-components';
import {ObjectInspector} from 'react-inspector';
import Modal from '../Modal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  border: 1px solid #eee;
  padding: 10px;
`;

const ModalContent = ({data}) => (
  <Wrapper>
    <ObjectInspector data={data} expandLevel={1} />
  </Wrapper>
);

export const ObjectViewer = ({children, data}) => (
  <Modal
    render={({closeModal}) => ModalContent({data})}>
    {children}
  </Modal>
);
