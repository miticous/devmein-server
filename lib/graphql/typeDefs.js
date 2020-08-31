"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  input BirthplaceInput {\n    placeId: String!\n    description: String!\n  }\n  input GraduationInput {\n    class: String\n    description: String\n    placeId: String\n  }\n  input ResidenceInput {\n    description: String\n    placeId: String\n  }\n  type Query {\n    user: User\n    profile: Profile\n    profiles(searchType: String!): [Profile]\n    chat(matchId: String!): Chat\n    matches: [Match]\n  }\n  type Love {\n    range: [Int]\n    genre: String\n  }\n  type FriendShip {\n    range: [Int]\n    genre: String\n  }\n  type UserConfigs {\n    maxDistance: String\n    love: Love\n    friendShip: FriendShip\n  }\n  type User {\n    email: String\n    configs: UserConfigs!\n    profileStatus: String\n  }\n  type Images {\n    _id: String\n    image: String\n  }\n  type Loc {\n    coordinates: [String]!\n  }\n  type Birthplace {\n    placeId: String!\n    description: String!\n    lat: String\n    lng: String\n    UTC: String\n  }\n  type Graduation {\n    class: String\n    description: String\n    placeId: String\n  }\n  type Residence {\n    description: String\n    placeId: String\n  }\n  type Text {\n    text: String!\n    title: String!\n    subtitle: String!\n  }\n  type Astral {\n    indexes: String\n    zodiac: String\n    mandala: String\n    texts: [Text]!\n  }\n  type Profile {\n    _id: String\n    name: String\n    birthday: String\n    images: [Images]\n    birthplace: Birthplace\n    loc: Loc\n    astral: Astral\n    genre: String\n    eyes: String\n    occupation: String\n    graduation: Graduation\n    residence: Residence\n    sexualOrientations: [String]\n  }\n  type Message {\n    _id: String\n    senderId: String\n    receiverId: String\n    sentAt: String\n    text: String\n    viewed: Boolean\n  }\n  type Chat {\n    _id: String\n    startedAt: String\n    participant: Profile\n    messages: [Message]\n  }\n  type Match {\n    _id: String\n    startedAt: String\n    profileMatched: Profile\n    lastMessage: Message\n    unreadMessages: String\n    type: String!\n  }\n  type Mutation {\n    editProfile(\n      name: String!\n      birthday: String!\n      eyes: String\n      occupation: String\n      genre: String!\n      sexualOrientations: [String]!\n      birthplace: BirthplaceInput!\n      graduation: GraduationInput\n      residence: ResidenceInput\n    ): Profile\n    sendMessage(matchId: String!, message: String!): Chat\n    likeSomeone(userLikedId: String!, type: String!): Profile\n    unlikeSomeone(userUnlikedId: String!, type: String!): String\n    sendGeoLocation(latitude: String!, longitude: String!): String\n    saveUserConfigs(\n      maxDistance: String\n      searchLoveAgeRange: [Int]!\n      searchFriendAgeRange: [Int]!\n      searchLoveGenre: String!\n      searchFriendGenre: String!\n      profileStatus: String!\n    ): String\n    addProfileImage(file: String!): String\n    removeProfileImage(imageId: String!): String\n  }\n  type Subscription {\n    newMessage: Chat\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var _default = (0, _apolloServerExpress.gql)(_templateObject());

exports["default"] = _default;