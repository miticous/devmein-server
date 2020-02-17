import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    user: User
    profile: Profile
  }
  type User {
    email: String
    name: String
  }
  type File {
    filename: String
    mimetype: String
    encoding: String
  }
  type Images {
    _id: String
    image: String
  }
  type Profile {
    _id: String
    name: String
    birthday: String
    images: [Images]
  }
  type Mutation {
    createProfile(name: String, birthday: String, file: String, filename: String): Profile
  }
`;
