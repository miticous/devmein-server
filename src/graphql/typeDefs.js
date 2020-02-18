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
  type Message {
    _id: String
    sender_id: String
    receiver_id: String
    sentAt: String
    text: String
    viewed: Boolean
  }
  type Chat {
    _id: String
    startedAt: String
    participants: [Profile]
    messages: [Message]
  }
  type Mutation {
    createProfile(name: String, birthday: String, file: String, filename: String): Profile
    sendMessage(targetUserId: String, message: String): Chat
  }
`;
