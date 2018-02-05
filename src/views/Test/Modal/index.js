import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {injectIntl, FormattedMessage} from 'react-intl';
import Modal from 'Components/Modal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  button {
    background: #e8e8e8;
    margin: 10px;
    padding: 5px;
  }
`;

// Component we will render in the modal
const ModalContent = ({onClose}) => (
  <Wrapper>
    <button onClick={event => console.info('log modal message')}>
      <FormattedMessage
        id="views.Test.Modal.logMessage"
        defaultMessage="Log message"
      />
    </button>
    <button onClick={event => onClose()}>
      <FormattedMessage
        id="views.Test.Modal.close"
        defaultMessage="Close [x]"
      />
    </button>
  </Wrapper>
);

ModalContent.propTypes = {
  onClose: PropTypes.func
};

// instead of a HOC we use a render prop and give it the component to render in the modal
const Test = () => {
  return (
    <Modal
      onClose={() => console.info('onClose modal')}
      render={({closeModal}) => <ModalContent onClose={closeModal} />}>
      <h1>Click to Display Modal</h1>
    </Modal>
  );
};

export default injectIntl(Test);
