import { gql } from 'apollo-server-express';

export default gql`
  input BirthplaceInput {
    placeId: String
    description: String
    lat: String
    lng: String
  }
  type Query {
    user: User
    profile: Profile
    home(maxDistance: String): [Profile]
    chat(matchId: String): Chat
    matches: [Match]
  }
  type User {
    email: String
    name: String
  }
  type Images {
    _id: String
    image: String
  }
  type Loc {
    coordinates: [String]
  }
  type Birthplace {
    placeId: String
    description: String
    lat: String
    lng: String
  }
  type Profile {
    _id: String
    name: String
    birthday: String
    images: [Images]
    birthplace: Birthplace!
    loc: Loc
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
  type Match {
    _id: String
    startedAt: String
    matches: [Profile]
    lastMessage: Message
  }
  type Mutation {
    createProfile(
      name: String
      birthday: String
      file: String
      filename: String
      input: BirthplaceInput
    ): Profile
    sendMessage(matchId: String!, message: String!): Chat
    likeSomeone(userLikedId: String!): Match
    sendGeoLocation(latitude: String!, longitude: String!): String
  }
  type Subscription {
    updateChat: Chat
  }
`;
