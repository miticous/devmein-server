import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    uploads: [File]
  }
  type File {
    filename: String
    mimetype: String
    encoding: String
  }
  type Profile {
    name: String
    birthday: String
  }
  type Mutation {
    createProfile(name: String, birthday: String, file: String, filename: String): Profile
  }
`;
