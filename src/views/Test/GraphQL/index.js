import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';
// either import or use local gql query
//import ChannelsListQuery from 'GraphQL/ChannelsListQuery.graphql';

const GQL_QUERY = gql`
  query {
    channels {
      id
      name
    }
  }
`;

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

const ChannelsList = ({data: {loading, error, channels}, handler}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <ul>
      {channels.map(ch => <li key={ch.id} onClick={() => handler({id: ch.id})}>{ch.name}</li>)}
    </ul>
  );
};

ChannelsList.propTypes = {
  data: PropTypes.object.isRequired,
};


class Workspace extends React.Component {
  static propTypes = {
    greeting: PropTypes.string,
    match: PropTypes.object,
    location: PropTypes.object,
    data: PropTypes.object,
  };

  handler = ({id}) => {
    console.info('handler', id);
  };

  render() {
    const {greeting, match, location, data} = this.props;
    const {id = 0} = match.params;

    // console.info('match', match);
    // console.info('location', location);

    return (
      <Container>
        <h1>{greeting} {id}</h1>
        <ul>
          <li><Link to="/test/gql">gQL</Link></li>
          <li><Link to="/test/gql/1?q=1">gQL 1?q=1</Link></li>
          <li><Link to="/test/gql/2">gQL 2</Link></li>
          <li><Link to="/test/gql/3">gQL 3</Link></li>
        </ul>
        <br />
        <ChannelsList id={id} data={data} handler={this.handler} />
      </Container>
    );
  }
}

// graphql HOC adds data: {loading, errors, channels} object to props
// either import (see imports) or use local gql query
export default graphql(GQL_QUERY)(Workspace);
