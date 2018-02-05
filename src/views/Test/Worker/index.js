import React from 'react';

const MyWorker = require('worker-loader?name=workers/[name].[hash].js!../../../workers/worker.js');

class Worker extends React.Component {
  state = {
    message: null,
    message2: null,
  };


  postMessage = msg => {
    const worker = new MyWorker();
    worker.postMessage({ a: 1 });
    worker.onmessage = event => {
      this.setState(() => ({
        message: event.data,
      }));
    };

    const worker2 = new MyWorker();
    worker2.postMessage({ a: 1 });
    worker2.onmessage = event => {
      this.setState(() => ({
        message2: event.data,
      }));
    };
  };

  render() {
    return (
      <div>
        <h1>Message: {this.state.message}</h1>
        <h1>Message: {this.state.message2}</h1>
        <button onClick={this.postMessage}>Send Message</button>
      </div>
    );
  }
}

export default Worker;
