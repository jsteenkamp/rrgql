import React from 'react';
import {Provider, Subscribe, Container} from 'unstated';

class CounterContainer extends Container {
  state = {
    count: 0,
  };

  increment() {
    this.setState({count: this.state.count + 1});
  }

  decrement() {
    this.setState({count: this.state.count - 1});
  }
}

const Counter = () => {
  return (
    <Provider>
      <Subscribe to={[CounterContainer]}>
        {counter => (
          <div>
            <button onClick={() => counter.decrement()}>-</button>
            <span>{counter.state.count}</span>
            <button onClick={() => counter.increment()}>+</button>
          </div>
        )}
      </Subscribe>
      <Subscribe to={[CounterContainer]}>
        {counter => {
          return <h1>{counter.state.count}</h1>;
        }}
      </Subscribe>
    </Provider>
  );
};

export default Counter;
