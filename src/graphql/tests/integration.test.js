import axios from 'axios';
import moment from 'moment';
import { createTestClient } from 'apollo-server-integration-testing';
import mongoose from 'mongoose';
import generarateName from '../../util/randomName';
import FILE_B64 from '../../__mocks__/fileb64';
import { typeDefs, resolvers, context, ApolloServer, app } from '../..';
import Profile from '../../models/Profile';
import User from '../../models/User';

const CREATE_PROFILE = `
  mutation($file: String, $name: String, $birthday: String, $input: BirthplaceInput) {
    createProfile(file: $file, name: $name, birthday: $birthday, input: $input) {
      _id
      name
      birthday
      images {
        _id
        image
      }
      birthplace {
        placeId
        description
        lat
        lng
      }
      loc {
        coordinates
      }
    }
  }
`;

// const max = 99999999;
// const min = 9999999;
// const getRandomNumber = () => Math.floor(Math.random() * (max - min + 1)) + min;
// const getPostData = () => ({
//   name: generarateName(),
//   email: `${getRandomNumber()}@gmail.com`,
//   password: getRandomNumber()
// });

test('Creating random user and profile', async () => {
  jest.setTimeout(30000);

  const PORT = 3000;

  const mockedUser = {
    name: 'Server Testing',
    email: 'server-testing@gmail.com',
    password: '123TEST123'
  };

  const birthplace = {
    placeId: '123a123b123c',
    description: generarateName(),
    lat: '-16.6782694',
    lng: '-49.3233247'
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({}),
    context
  });

  await Profile.findOneAndRemove({ email: mockedUser.email });
  await User.findOneAndRemove({ email: mockedUser.email });

  const server = app.listen(3000);

  await new Promise(resolve => server.on('listening', () => resolve()));

  await axios({
    method: 'post',
    url: `http://localhost:${PORT}/users`,
    data: {
      ...mockedUser
    }
  });

  const {
    data: { token },
    data: user
  } = await axios({
    method: 'post',
    url: `http://localhost:${PORT}/users/login`,
    data: {
      ...mockedUser
    }
  });

  const userKeys = Object.keys(user);

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

  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const {
    data: { createProfile: profile }
  } = await mutate(CREATE_PROFILE, {
    variables: { ...newProfile }
  });

  const profileKeys = Object.keys(profile).reduce((accumulator, key) => {
    if (Array.isArray(profile[key])) {
      return [...accumulator, ...Object.keys(profile[key][0])];
    }
    if (typeof profile[key] === 'object') {
      return [...accumulator, ...Object.keys(profile[key])];
    }
    return [...accumulator, key];
  }, []);

  await new Promise((resolve, reject) =>
    server.close(err => {
      if (err) {
        return reject();
      }
      return resolve();
    })
  );

  await mongoose.disconnect();

  expect(token).not.toBeNull();
  expect(profileKeys).toMatchSnapshot();
  expect(userKeys).toMatchSnapshot();
});
