/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import jwt, { Secret } from 'jsonwebtoken';
import expressPlayground from 'graphql-playground-middleware-express';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import authMiddleware from './middlewares/authMiddleware';
import { registerUser, login, logout, auth } from './services/user';
import ERROR_MESSAGES from './constants/errorMessages';
import User from './models/User';

require('dotenv').config();
require('./database');

const pubsub = new PubSub();

const context = async ({ req, connection }) => {
  if (connection) {
    return connection.context;
  }
  const authorization = req.headers.authorization || '';
  const token = authorization.replace('Bearer ', '');
  const { _id: userId } = jwt.verify(token, process.env.JWT_KEY);

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    return {
      authorization: req.headers.authorization,
      user,
      pubsub
    };
  } catch (error) {
    throw new Error('User not found');
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  subscriptions: {
    onConnect: async connectionParams => {
      const { _id: userId } = jwt.verify(connectionParams.token, process.env.JWT_KEY);
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      return {
        user,
        pubsub
      };
    },
    onDisconnect: () => false
  },
  playground: true,
  introspection: true
});

const app = express();

app.use(bodyParser.json({ limit: '20mb' }));

app.post('/users', async (req, res) => {
  try {
    await registerUser(req.body);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const data = await login(req.body);
    return res.status(200).send(data);
  } catch (error) {
    return res.status(401).send({ error });
  }
});

app.post('/users/logout', async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw ERROR_MESSAGES.LOGOUT_FAILED;
    }
    const token = authorization.replace('Bearer ', '');

    await logout(token);
    return res.status(200).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

app.get('/users/auth', async (req, res) => {
  try {
    const authorization = req.header('Authorization');
    const token = authorization ? authorization.replace('Bearer ', '') : null;
    const data = jwt.verify(token, process.env.JWT_KEY);
    const hasProfile = await auth({ userId: data._id, token });

    return res.status(200).send(hasProfile);
  } catch (error) {
    return res.status(401).send();
  }
});

app.use('/graphql', authMiddleware);

// curl localhost:4000/graphql \
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ0ZTNiZTM2Nzc3MzYzZTQzNzE1NzciLCJpYXQiOjE1ODE3MjYwMDN9.t5jVOwhnPdI6HIVDB3E4O7j8u5w2m-qtOF7O4Xk7AII" \
// -F operations='{ "query": "mutation ($file: Upload!, $name: String, $birthday: String) { createProfile(file: $file, name: $name, birthday: $birthday) { name } }", "variables": { "file": null, "name": "Murilo Andrade Medeiros", "birthday": "07-03-1994 08:45" } }' \
// -F map='{ "0": ["variables.file"] }' \
// -F 0=@a.txt

// curl localhost:4000/graphql \
// -F operations='{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) { filename } }", "variables": { "file": null } }' \
// -F map='{ "0": ["variables.file"] }' \
// -F 0=@a.txt

// curl localhost:4000/graphql \
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ0ZTNiZTM2Nzc3MzYzZTQzNzE1NzciLCJpYXQiOjE1ODE3MjYwMDN9.t5jVOwhnPdI6HIVDB3E4O7j8u5w2m-qtOF7O4Xk7AII" \
// -F operations='{ "query": "mutation ($file: Upload!, $name: String, $birthday: String) { createProfile(file: $file, name: $name, birthday: $birthday) { name } }", "variables": { "file": null, "name": "Murilo Andrade Medeiros", "birthday": "07-03-1994 08:45" } }' \
// -F map='{ "0": ["variables.file"] }' \
// -F 0=@tattoo.jpg

apolloServer.applyMiddleware({ app });

app.get(`/`, (_, res) => {
  res.setHeader(`Access-Control-Allow-Origin`, `*`);
  res.send({ token: process.env.API_GITHUB_TOKEN });
});

app.get(`/playground`, expressPlayground({ endpoint: `/graphql` }));

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 8080 }, () => {
  console.log(`🚀 Server ready at http://localhost:${8080}${apolloServer.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${8080}${apolloServer.subscriptionsPath}`);
});

export { typeDefs, resolvers, context, ApolloServer, app };
