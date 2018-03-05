# React Workspace Components

Prototyping with [React](http://facebook.github.io/react/), [Redux](http://redux.js.org/), and [GraphQL](http://graphql.org/) using [Apollo](http://dev.apollodata.com/).

Current requirement is for desktop web browsers for data visualisation applications so design is not intended for small screens or mobile devices.

[Demo](https://rrgql.jsx.nz)

## Tooling

We use [Yarn](https://yarnpkg.com/), [babel](https://babeljs.io/), and [webpack](https://webpack.js.org/).

## Structure

`src` - application source files that are complied by [babel](https://babeljs.io/) and build by [webpack](https://webpack.js.org/).

`dist` - deployment output. The development and production servers use files located in `dist`. Production built application files are saved in `dist/build`. Express server mappings serve static content from `build` and `public` directories on root path. The server API and processing modules are in the `dist/server` directory.

`dist/public/app` - external application configuration. These files are used for external configurations such as mapping soft data models to UI components. These files are not compiled by Webpack and should use ES5 JavaScript. The files are loaded using [RequireJS](http://requirejs.org/) to provide a module system for code structure and reuse. It is also possible to expose the UI application to these files. Most application will not need this type of configuration, however it is a good Proof-of-Concept.

`_assets` - build assets that are not deployed. The i18n messages are parsed and saved in `_assets/locales/data.json` when running `yarn intl`. This file is required for building the application and is bundled in the build output. Typically this file will be pulled from a separate repo used to manage translations. We do not load locales asynchronously so the locales data does not have to be deployed.

## Redux

Create FSAs using [redux-actions](https://github.com/acdlite/redux-actions).

Ensure redux data is immutable using [immutability-helper](https://github.com/kolodny/immutability-helper).

Uses [redux-saga](https://redux-saga.js.org/) for async (side-effects) in preference to thunks.

## GraphQL
 
With GraphQL and Apollo it is likey that Redux is not required at all. Components can their associated data queries can be collocated and Apollo client can handle caching and batching efficiently.

Apollo can also provide a GraphQL query solution for access local storage and state resulting in a common and consistent way of providing data to components.

GraphQL also makes it easier to create more modular and self-contained components by co-locating data queries within the associated component. This removes the need for redux/redux-saga to handle side-effects and provides additional benefits like caching.  

[Query Components with Apollo](https://dev-blog.apollodata.com/query-components-with-apollo-ec603188c157)
 
[Apollo React Client](http://dev.apollodata.com/react/) and [Apollo Server](http://dev.apollodata.com/tools/graphql-server/index.html) with [Express](https://expressjs.com/)

For development [GraphiQL](https://github.com/graphql/graphiql) is available at `http://localhost:3000/graphiql`

## Routing

[react-router (v4)](https://reacttraining.com/react-router/)

Routing has not been added to the Tab navigation in this version however this is easily done. Some routes can be seen in the test components although you need to use the browser back button to return the list of test components.

Routing to a Sign In form is available and disabled in the demo.

## CSS

No Sass/SCSS pre-processor, use [Styled Components](https://github.com/styled-components/styled-components), [Styled Theming](https://github.com/styled-components/styled-theming), and [Polished](https://github.com/styled-components/polished).

[Forget Normalize/Reset](http://jaydenseric.com/blog/forget-normalize-or-resets-lay-your-own-css-foundation) and use `base.css` that strips and adds styles where it makes sense to minimize the amount of declarations and overrides you will have to make later. 

Web browsers do have sane albeit ugly defaults. It does not make sense to reset everything.

## API

The application API allows us to use templates to format and map data to views and components and use plugins to render 3rd party components in views.
 
The application api methods are defined in `/app/api`. Typically these will methods will result in application state updates.

Developers can add `modules` in `/app/modules` which are imported and used by application components.

## Browsers

Current popular cross-platform evergreen web browsers which means Chrome and Firefox.

Also tested on Safari and Edge.  
 
Tested on Windows 7 with Microsoft Internet Explorer 11 but do not intend to support legacy browsers.

## Roadmap

- Responsive design for all screens/devices.
- Optimise bundle sizes and downloading.
- Progressive Web App (PWA).
