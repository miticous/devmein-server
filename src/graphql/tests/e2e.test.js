import axios from 'axios';
import moment from 'moment';
import { createTestClient } from 'apollo-server-integration-testing';
import generarateName from '../../util/randomName';
import FILE_B64 from '../../__mocks__/fileb64';
import { typeDefs, resolvers, context, ApolloServer } from '../..';

// const GET_HOME = gql`
//   query {
//     home(maxDistance: "8000") {
//       name
//       _id
//       images {
//         image
//       }
//     }
//   }
// `;

const CREATE_PROFILE = `
  mutation($file: String, $name: String, $birthday: String, $input: BirthplaceInput) {
    createProfile(file: $file, name: $name, birthday: $birthday, input: $input) {
      _id
      images {
        _id
        image
      }
    }
  }
`;

jest.setTimeout(22000);

describe('Should create multiple users and profiles perfectly', () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({}),
    context
  });

  it('should create multiple users', async () => {
    const max = 99999999;
    const min = 9999999;
    const getRandomNumber = () => Math.floor(Math.random() * (max - min + 1)) + min;
    const getPostData = () => ({
      name: generarateName(),
      email: `${getRandomNumber()}@gmail.com`,
      password: getRandomNumber()
    });

    const user = getPostData();

    await axios({
      method: 'post',
      url: 'http://localhost:4000/users',
      data: {
        ...user
      }
    });

    const {
      data: { token, hasProfile }
    } = await axios({
      method: 'post',
      url: 'http://localhost:4000/users/login',
      data: {
        ...user
      }
    });
    console.log(token);
    expect(token).not.toBeNull();

    if (hasProfile) {
      console.log('Profile exists [test.. debug]\n');
    }

    const birthplace = {
      placeId: '123a123b123c',
      description: generarateName(),
      lat: '-16.6782694',
      lng: '-49.3233247'
    };

    const newProfile = {
      name: user.name,
      birthday: moment(new Date())
        .subtract(19, 'years')
        .toString(),
      file: FILE_B64,
      input: {
        ...birthplace
      }
    };
    try {
      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      const { data: createProfile } = await mutate(CREATE_PROFILE, {
        variables: { ...newProfile }
      });
      expect(Object.keys(createProfile)).not.toBeNull();
    } catch (error) {
      console.log(error);
    }
  });

  // it('should create multiple users', async () => {
  //   // create a test server to test against, using our production typeDefs,
  //   // resolvers, and dataSources.

  //   // mock the dataSource's underlying fetch methods
  //   // launchAPI.get = jest.fn(() => [mockLaunchResponse]);
  //   // userAPI.store = mockStore;
  //   // userAPI.store.trips.findAll.mockReturnValueOnce([{ dataValues: { launchId: 1 } }]);

  //   // use the test server to create a query function
  //   const { query } = createTestClient(server);

  //   // run query against the server and snapshot the output
  //   const res = await query({ query: GET_HOME, variables: { id: 1 } });
  //   console.log(res.data.home);
  //   expect(res).toMatchSnapshot();
  // });
});
