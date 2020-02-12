import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { getAll } from './src/database';

const start = async () => {
  const typeDefs = gql`
    type Query {
      comments: [Comment]
    }
    type Comment {
      _id: String
      name: String
      email: String
      text: String
    }
  `;

  const resolvers = {
    Query: {
      comments: async () => getAll('comments')
    }
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

start();
