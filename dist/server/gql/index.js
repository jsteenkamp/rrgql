import express from 'express';
import { graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import Schema from './data/schema';
import Resolvers from './data/resolvers';

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  allowUndefinedInResolve: false,
  printErrors: true,
});

const app = express();

export default function(config) {
  app.use(graphqlExpress({
    schema: executableSchema,
    context: {}
  }));
  console.info('GraphQL is available at %s', config.gql.path);
  return app;
}
