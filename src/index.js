import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
//import {ApolloProvider} from 'react-apollo';
import {IntlProvider, addLocaleData} from 'react-intl';
import {ThemeProvider} from 'styled-components';
// import the required language locales here
import en from 'react-intl/locale-data/en';
import {configureStore} from './store/store';
import Routes from './views/Routes';
import theme from './styles';
import localeData from '../_assets/locales/data.json';
//import renderer from './app/render';
// import {AppContainer} from 'react-hot-loader';

import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
//import { ApolloLink } from 'apollo-link';
//import { withClientState } from 'apollo-link-state';

//const stateLink = withClientState({ resolvers, cache, defaults });

// { uri: '/graphql' }
const client = new ApolloClient({
  //link: ApolloLink.from([stateLink, new HttpLink()]),
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

// Translation strings are bundled into build, not loaded dynamically, in development use defaults
// add react-intl locales
addLocaleData([...en]);

// built-in async configs, typically it is a 3rd party ES5 file
let envConfigUrl = '/config/production.json';
// add react-intl locales
let messages = localeData;

// in development do not load messages bundle and use defaults
if (process.env.NODE_ENV === 'development') {
  envConfigUrl = '/config/development.json';
  messages = {en: {}};
}

// render app to <div id="root"></div> in index.html
// portals are rendered to <div id="portal"></div> so we do not need to add/remove element each time
const renderApp = ({config}) => {
  // default language (likely set from stored user profile, passed in config)
  const language = config.defaultLocale || 'en';
  // todo - auth will be via authentication flow and handle dev
  const {auth, ...rest} = config;
  // set Store initial states
  const {store} = configureStore({
    config: rest,
    user: auth,
  });

  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <IntlProvider locale={language} messages={messages[language]}>
          <ThemeProvider theme={theme}>
              <Routes />
          </ThemeProvider>
        </IntlProvider>
      </ApolloProvider>
    </Provider>,
    document.getElementById('root')
  );
};

// app is rendered after configuration is loaded from client modules
window.rrgql = {
  // load config before rendering app
  render: async ({config = {}, mappers = {}, formatters = {}, filters = {}, icons = {}}) => {
    // todo - test passing these via external handlers
    // call externals with required internal modules
    //const {grid, table} = mappers;
    //const configMappers = {grid: grid(renderer), table: table(renderer)};

    // environment must be loaded from JSON files for deployment requirements
    const environment = await fetch(envConfigUrl)
      .then(response => response.json())
      .catch(error => console.error('Config Error', error));
    // render react app
    renderApp({
      config: {
        ...config,
        ...environment,
        mappers,
        formatters,
        filters,
        icons,
      },
    });
  },
};
