import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, FormattedMessage} from 'react-intl';
import compose from 'recompose/compose';
// redux data is always accessed using selectors
import {tabViewData} from 'Store/views/selectors';
import deleteView from '../../app/api/deleteView';
// reusable components
import Panel from 'Components/Panel';
import AppHeader from 'Components/AppHeader';
import Header from 'Components/Header';
import Footer from 'Components/Footer';
import {Tabs, TabPanel} from 'Components/Tabs';
// view specific components
import View from './components/View';
import PlugIn from 'Components/PlugIn';
import {HeaderContextMenu, FooterContextMenu} from './components/context-menus';
import TestModal from './components/modals';

// app version from package.json injected by webpack
const appVersion = APP_VERSION;

class WorkSpace extends React.Component {
  onTabClose = idx => {
    const {id} = this.props.data[idx];
    deleteView({id});
  };

  render() {
    const {data, config} = this.props;
    return (
      <Panel>
        <AppHeader toggleMenu={this.toggleMenu} showLogo={config.show.logo} />

        <HeaderContextMenu>
          <Header>
            <h2>
              <FormattedMessage
                id="views.Workspace.Header"
                defaultMessage="Workspace Header"
              />
            </h2>
            <TestModal>
              <h2>
                <FormattedMessage
                  id="views.Workspace.Header.Modal"
                  defaultMessage="Modal"
                />
              </h2>
            </TestModal>
          </Header>
        </HeaderContextMenu>

        <Tabs onRemove={this.onTabClose} hasIcon={true}>
          {data.map(view => {
            let ViewComponent = null;
            switch (view.type) {
              case 'plugin':
                const {data} = view;
                ViewComponent = <PlugIn src={data} data={view} />;
                break;

              default:
                ViewComponent = <View view={view} />;
            }
            return (
              <TabPanel key={view.id} name={view.name} viewType={view.type}>
                {ViewComponent}
              </TabPanel>
            );
          })}
        </Tabs>

        <FooterContextMenu>
          <Footer height={20}>
            <h1>
              <FormattedMessage
                id="views.Workspace.App.Footer"
                defaultMessage="App Footer"
              />
            </h1>
            <div style={{fontSize: '0.8em'}}>v{appVersion}</div>
          </Footer>
        </FooterContextMenu>
      </Panel>
    );
  }
}

WorkSpace.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
};

const enhance = compose(
  connect(state => ({
    config: state.config,
    data: tabViewData(state),
  })),
  injectIntl,
);

export default enhance(WorkSpace);
