import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import authMiddleware from './middlewares/authMiddleware';
import { registerUser, login } from './services/user';

require('./database');

const start = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();

  app.use(bodyParser.json());

  app.post('/users', async (req, res) => {
    try {
      const data = await registerUser(req.body);
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.post('/users/login', async (req, res) => {
    try {
      const data = await login(req.body);
      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send(error);
    }
  });

  app.use('/graphql', authMiddleware);

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

start();
