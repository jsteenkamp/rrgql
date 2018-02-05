import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from './messages';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  strong {
      color: blue;
    };
  h1 {
      font-size: calc((2vh + 2vw)/2);
      color: blue;
    };
`;

const MessageWidget = ({ greeting }) => <h1>{greeting}</h1>;

MessageWidget.propTypes = {
  greeting: PropTypes.string,
};

const TestView = ({ intl }) => {
  const { formatMessage, formatDate } = intl;
  const values = {
    name: 'Eric',
    unreadCount: 1000,
    date: new Date().getTime(),
  };
  const formattedMessage = formatMessage(messages.greeting, values);

  return (
    <Wrapper>
      <MessageWidget greeting={formattedMessage} />
      <FormattedMessage
        id="views.Test.Intl.welcome-inline"
        defaultMessage={
          `Hello {name}, you have {unreadCount, number} {unreadCount, plural, one {message} other {messages}}, at {date}`
        }
        values={{
          ...values,
          name: <strong>{values.name}</strong>,
          date: formatDate(values.date, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            seconds: '2-digit',
            timeZoneName: 'short',
          }),
        }}
      />
    </Wrapper>
  );
};

TestView.propTypes = {
  intl: PropTypes.object.isRequired,
};

// inject react-intl so we can access methods on props
export default injectIntl(TestView);
