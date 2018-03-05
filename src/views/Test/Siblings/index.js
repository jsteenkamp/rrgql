import React from 'react';
import uuid from 'uuid/v4';
import {connect} from 'react-redux';

class Tabs extends React.Component {
  render() {
    return (
      <div
        style={{
          height: '30px',
          background: 'lightblue',
          display: 'flex',
          flexDirection: 'row',
        }}>
        {this.props.data.map(tab => <div key={tab.id}>{tab.title}</div>)}
      </div>
    );
  }
}

class Panels extends React.Component {
  setTitle = index => {
    this.props.setTitle({index, title: uuid()});
  };

  changeTitle = () => {
    setInterval(() => {
      this.props.setTitle({index: 4, title: this.props.mappers.table.table.setTitle()});
    },200);
  };

  componentDidMount() {
    this.changeTitle();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'lightgreen',
          display: 'flex',
          flexDirection: 'row',
        }}>
        {this.props.data.map((tab, index) => (
          <div key={tab.id} onClick={() => this.setTitle(index)}>
            {tab.title}
          </div>
        ))}
      </div>
    );
  }
}

class Container extends React.Component {
  state = {
    data: [
      {id: uuid(), title: 'One'},
      {id: uuid(), title: 'Two'},
      {id: uuid(), title: 'Three'},
      {id: uuid(), title: 'Four'},
      {id: uuid(), title: 'Five'},
    ],
  };

  setTitle = ({index, title}) => {
    this.setState(({data}) => {
      return {
        data: data.map((tab, idx) => {
          return idx === index ? {...tab, title} : tab;
        }),
      };
    });
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'lightgreen',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Tabs data={this.state.data} />
        <Panels data={this.state.data} setTitle={this.setTitle} mappers={this.props.config.mappers} />
      </div>
    );
  }
}

export default connect(state => ({
  config: state.config,
}))(Container);
