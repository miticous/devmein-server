"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

var _apolloServerIntegrationTesting = require("apollo-server-integration-testing");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _randomName = _interopRequireDefault(require("../../util/randomName"));

var _fileb = _interopRequireDefault(require("../../__mocks__/fileb64"));

var _ = require("../..");

var _Profile = _interopRequireDefault(require("../../models/Profile"));

var _User = _interopRequireDefault(require("../../models/User"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CREATE_PROFILE = "\n  mutation($file: String, $name: String, $birthday: String, $input: BirthplaceInput) {\n    createProfile(file: $file, name: $name, birthday: $birthday, input: $input) {\n      _id\n      name\n      birthday\n      images {\n        _id\n        image\n      }\n      birthplace {\n        placeId\n        description\n        lat\n        lng\n      }\n      loc {\n        coordinates\n      }\n    }\n  }\n"; // const max = 99999999;
// const min = 9999999;
// const getRandomNumber = () => Math.floor(Math.random() * (max - min + 1)) + min;
// const getPostData = () => ({
//   name: generarateName(),
//   email: `${getRandomNumber()}@gmail.com`,
//   password: getRandomNumber()
// });

test('Creating random user and profile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var PORT, mockedUser, birthplace, apolloServer, server, _yield$axios, token, user, userKeys, newProfile, _createTestClient, mutate, _yield$mutate, profile, profileKeys;

  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          jest.setTimeout(30000);
          PORT = 3000;
          mockedUser = {
            name: 'Server Testing',
            email: 'server-testing@gmail.com',
            password: '123TEST123'
          };
          birthplace = {
            placeId: '123a123b123c',
            description: (0, _randomName["default"])(),
            lat: '-16.6782694',
            lng: '-49.3233247'
          };
          apolloServer = new _.ApolloServer({
            typeDefs: _.typeDefs,
            resolvers: _.resolvers,
            dataSources: function dataSources() {
              return {};
            },
            context: _.context
          });
          _context.next = 7;
          return _Profile["default"].findOneAndRemove({
            email: mockedUser.email
          });

        case 7:
          _context.next = 9;
          return _User["default"].findOneAndRemove({
            email: mockedUser.email
          });

        case 9:
          server = _.app.listen(3000);
          _context.next = 12;
          return new Promise(function (resolve) {
            return server.on('listening', function () {
              return resolve();
            });
          });

        case 12:
          _context.next = 14;
          return (0, _axios["default"])({
            method: 'post',
            url: "http://localhost:".concat(PORT, "/users"),
            data: _objectSpread({}, mockedUser)
          });

        case 14:
          _context.next = 16;
          return (0, _axios["default"])({
            method: 'post',
            url: "http://localhost:".concat(PORT, "/users/login"),
            data: _objectSpread({}, mockedUser)
          });

        case 16:
          _yield$axios = _context.sent;
          token = _yield$axios.data.token;
          user = _yield$axios.data;
          userKeys = Object.keys(user);
          newProfile = {
            name: user.name,
            birthday: (0, _moment["default"])(new Date()).subtract(19, 'years').toString(),
            file: _fileb["default"],
            input: _objectSpread({}, birthplace)
          };
          _createTestClient = (0, _apolloServerIntegrationTesting.createTestClient)({
            apolloServer: apolloServer,
            extendMockRequest: {
              headers: {
                Authorization: "Bearer ".concat(token)
              }
            }
          }), mutate = _createTestClient.mutate;
          _context.next = 24;
          return mutate(CREATE_PROFILE, {
            variables: _objectSpread({}, newProfile)
          });

        case 24:
          _yield$mutate = _context.sent;
          profile = _yield$mutate.data.createProfile;
          profileKeys = Object.keys(profile).reduce(function (accumulator, key) {
            if (Array.isArray(profile[key])) {
              return [].concat((0, _toConsumableArray2["default"])(accumulator), (0, _toConsumableArray2["default"])(Object.keys(profile[key][0])));
            }

            if ((0, _typeof2["default"])(profile[key]) === 'object') {
              return [].concat((0, _toConsumableArray2["default"])(accumulator), (0, _toConsumableArray2["default"])(Object.keys(profile[key])));
            }

            return [].concat((0, _toConsumableArray2["default"])(accumulator), [key]);
          }, []);
          _context.next = 29;
          return new Promise(function (resolve, reject) {
            return server.close(function (err) {
              if (err) {
                return reject();
              }

              return resolve();
            });
          });

        case 29:
          _context.next = 31;
          return _mongoose["default"].disconnect();

        case 31:
          expect(token).not.toBeNull();
          expect(profileKeys).toMatchSnapshot();
          expect(userKeys).toMatchSnapshot();

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));