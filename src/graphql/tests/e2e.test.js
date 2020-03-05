import gql from 'graphql-tag';
import { typeDefs, resolvers, context, ApolloServer } from '../..';

const { createTestClient } = require('apollo-server-testing');

const GET_HOME = gql`
  query {
    home(maxDistance: "8000") {
      name
      _id
      images {
        image
      }
    }
  }
`;

it('fetches single launch', async () => {
  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({}),
    context
  });

  // mock the dataSource's underlying fetch methods
  // launchAPI.get = jest.fn(() => [mockLaunchResponse]);
  // userAPI.store = mockStore;
  // userAPI.store.trips.findAll.mockReturnValueOnce([{ dataValues: { launchId: 1 } }]);

  // use the test server to create a query function
  const { query } = createTestClient(server);

  // run query against the server and snapshot the output
  const res = await query({ query: GET_HOME, variables: { id: 1 } });
  console.log(res.data.home);
  expect(res).toMatchSnapshot();
});
