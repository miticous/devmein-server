import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    comments: [Comment]
  }
  type Comment {
    _id: String
    name: String
    email: String
    text: String
  }
  type User {
    _id: String
    email_verified: Boolean
    email: String
    password: String
  }
  type Mutation {
    signup(email: String, password: String): User
  }
`;
