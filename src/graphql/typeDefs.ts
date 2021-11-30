import { gql } from 'apollo-server-express';

export default gql`
  input BirthplaceInput {
    placeId: String!
    description: String!
  }
  input GraduationInput {
    class: String
    description: String
    placeId: String
  }
  input ResidenceInput {
    description: String
    placeId: String
  }
  type Query {
    user: User
    profile: Profile
    profiles(searchType: String!): [Profile]
    chat(matchId: String!): Chat
    matches: [Match]
  }
  type Love {
    range: [Int]
    genre: String
  }
  type FriendShip {
    range: [Int]
    genre: String
  }
  type UserConfigs {
    maxDistance: String
    love: Love
    friendShip: FriendShip
  }
  type User {
    email: String
    configs: UserConfigs!
    profileStatus: String
    plan: String!
  }
  type Images {
    _id: String
    image: String
  }
  type Loc {
    coordinates: [String]!
  }
  type Birthplace {
    placeId: String!
    description: String!
    lat: String
    lng: String
    UTC: String
  }
  type Graduation {
    class: String
    description: String
    placeId: String
  }
  type Residence {
    description: String
    placeId: String
  }
  type Text {
    text: String!
    title: String!
    subtitle: String!
    type: String!
  }
  type Astral {
    indexes: String
    zodiac: String
    mandala: String
    texts: [Text]!
  }
  type Profile {
    _id: String
    name: String
    birthday: String
    images: [Images]
    birthplace: Birthplace
    loc: Loc
    astral: Astral
    genre: String
    eyes: String
    occupation: String
    graduation: Graduation
    residence: Residence
    sexualOrientations: [String]
    shownTexts: [String]
  }
  type Message {
    _id: String
    senderId: String
    receiverId: String
    sentAt: String
    text: String
    viewed: Boolean
  }
  type Chat {
    _id: String
    startedAt: String
    participant: Profile
    messages: [Message]
  }
  type Match {
    _id: String
    startedAt: String
    profileMatched: Profile
    lastMessage: Message
    unreadMessages: String
    type: String!
  }
  type Mutation {
    editProfile(
      name: String!
      birthday: String!
      eyes: String
      occupation: String
      genre: String!
      sexualOrientations: [String]!
      birthplace: BirthplaceInput!
      graduation: GraduationInput
      residence: ResidenceInput
      shownTexts: [String]
    ): Profile
    sendMessage(matchId: String!, message: String!): Chat
    likeSomeone(userLikedId: String!, type: String!): Profile
    unlikeSomeone(userUnlikedId: String!, type: String!): String
    sendGeoLocation(latitude: String!, longitude: String!): String
    saveUserConfigs(
      maxDistance: String
      searchLoveAgeRange: [Int]!
      searchFriendAgeRange: [Int]!
      searchLoveGenre: String!
      searchFriendGenre: String!
      profileStatus: String!
    ): String
    addProfileImage(file: String!): String
    removeProfileImage(imageId: String!): String
  }
  type Subscription {
    newMessage(matchId: String!): Chat
  }
`;
