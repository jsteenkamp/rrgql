import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  h1 {
   margin: 1em 0;
  }
`;

// we can use functional setState (pass setState() a function instead of an object)
const setGists = gists => (prevState, props) => ({ gists });

class Proxy extends React.Component {
  state = {
    gists: [],
  };

  // use async/await in preference to nested fetch promises
  componentDidMount() {
    (async () => {
      try {
        const res = await fetch('/api/0/proxy/gists');
        res.gists = await res.json();
        this.setState(setGists(res.gists.data));
      } catch (error) {
        console.info('Async Error', error);
      }
    })();
  }

  render() {
    return (
      <Container>
        <h1>Proxy Request</h1>
        <ul>
          {this.state.gists.map(gist => (
            <li key={gist.id}>{gist.description}</li>
          ))}
        </ul>
      </Container>
    );
  }
}

export default Proxy;
