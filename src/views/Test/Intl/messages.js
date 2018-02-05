import { defineMessages } from 'react-intl';

export default defineMessages({
    greeting: {
      id: 'views.Test.Intl.greeting',
      defaultMessage: 'Hello, {name}! you have {unreadCount, number} {unreadCount, plural, one {message} other {messages}}, at {date, date}',
      description: 'Greeting to welcome the user to the app',
    },
});