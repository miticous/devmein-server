"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ApolloServer", {
  enumerable: true,
  get: function get() {
    return _apolloServerExpress.ApolloServer;
  }
});
Object.defineProperty(exports, "typeDefs", {
  enumerable: true,
  get: function get() {
    return _typeDefs["default"];
  }
});
Object.defineProperty(exports, "resolvers", {
  enumerable: true,
  get: function get() {
    return _resolvers["default"];
  }
});
exports.app = exports.context = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _http = require("http");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _typeDefs = _interopRequireDefault(require("./graphql/typeDefs"));

var _resolvers = _interopRequireDefault(require("./graphql/resolvers"));

var _authMiddleware = _interopRequireDefault(require("./middlewares/authMiddleware"));

var _user = require("./services/user");

var _errorMessages = _interopRequireDefault(require("./constants/errorMessages"));

var _User = _interopRequireDefault(require("./models/User"));

require('dotenv').config();

require('./database');

var pubsub = new _apolloServerExpress.PubSub();

var context = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var req, connection, authorization, token, _jwt$verify, userId, user;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req = _ref.req, connection = _ref.connection;

            if (!connection) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", connection.context);

          case 3:
            authorization = req.headers.authorization || '';
            token = authorization.replace('Bearer ', '');
            _jwt$verify = _jsonwebtoken["default"].verify(token, process.env.JWT_KEY), userId = _jwt$verify._id;
            _context.next = 8;
            return _User["default"].findById(userId);

          case 8:
            user = _context.sent;

            if (user) {
              _context.next = 11;
              break;
            }

            throw new Error('User not found');

          case 11:
            return _context.abrupt("return", {
              authorization: req.headers.authorization,
              user: user,
              pubsub: pubsub
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function context(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.context = context;
var apolloServer = new _apolloServerExpress.ApolloServer({
  typeDefs: _typeDefs["default"],
  resolvers: _resolvers["default"],
  context: context,
  subscriptions: {
    onConnect: function () {
      var _onConnect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(connectionParams) {
        var _jwt$verify2, userId, user;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _jwt$verify2 = _jsonwebtoken["default"].verify(connectionParams.token, process.env.JWT_KEY), userId = _jwt$verify2._id;
                _context2.next = 3;
                return _User["default"].findById(userId);

              case 3:
                user = _context2.sent;

                if (user) {
                  _context2.next = 6;
                  break;
                }

                throw new Error('Invalid credentials');

              case 6:
                return _context2.abrupt("return", {
                  user: user,
                  pubsub: pubsub
                });

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function onConnect(_x2) {
        return _onConnect.apply(this, arguments);
      }

      return onConnect;
    }(),
    onDisconnect: function onDisconnect() {}
  }
});
var app = (0, _express["default"])();
exports.app = app;
app.use(_bodyParser["default"].json({
  limit: '20mb'
}));
app.post('/users', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _user.registerUser)(req.body);

          case 3:
            res.status(200).send();
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            res.status(400).send(_context3.t0.message);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}());
app.post('/users/login', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var data;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _user.login)(req.body);

          case 3:
            data = _context4.sent;
            return _context4.abrupt("return", res.status(200).send(data));

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", res.status(401).send({
              error: _context4.t0
            }));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function (_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}());
app.post('/users/logout', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var authorization, token;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            authorization = req.headers.authorization;

            if (authorization) {
              _context5.next = 4;
              break;
            }

            throw _errorMessages["default"].LOGOUT_FAILED;

          case 4:
            token = authorization.replace('Bearer ', '');
            _context5.next = 7;
            return (0, _user.logout)(token);

          case 7:
            return _context5.abrupt("return", res.status(200).send());

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            return _context5.abrupt("return", res.status(400).send({
              error: _context5.t0
            }));

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));

  return function (_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}());
app.get('/users/auth', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var authorization, token, data, hasProfile;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            authorization = req.header('Authorization');
            token = authorization ? authorization.replace('Bearer ', '') : null;
            data = _jsonwebtoken["default"].verify(token, process.env.JWT_KEY);
            _context6.next = 6;
            return (0, _user.auth)({
              userId: data._id,
              token: token
            });

          case 6:
            hasProfile = _context6.sent;
            return _context6.abrupt("return", res.status(200).send(hasProfile));

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            return _context6.abrupt("return", res.status(401));

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 10]]);
  }));

  return function (_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}());
app.use('/graphql', _authMiddleware["default"]); // curl localhost:4000/graphql \
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ0ZTNiZTM2Nzc3MzYzZTQzNzE1NzciLCJpYXQiOjE1ODE3MjYwMDN9.t5jVOwhnPdI6HIVDB3E4O7j8u5w2m-qtOF7O4Xk7AII" \
// -F operations='{ "query": "mutation ($file: Upload!, $name: String, $birthday: String) { createProfile(file: $file, name: $name, birthday: $birthday) { name } }", "variables": { "file": null, "name": "Murilo Andrade Medeiros", "birthday": "07-03-1994 08:45" } }' \
// -F map='{ "0": ["variables.file"] }' \
// -F 0=@a.txt
// curl localhost:4000/graphql \
// -F operations='{ "query": "mutation ($file: Upload!) { singleUpload(file: $file) { filename } }", "variables": { "file": null } }' \
// -F map='{ "0": ["variables.file"] }' \
// -F 0=@a.txt
// curl localhost:4000/graphql \
// -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ0ZTNiZTM2Nzc3MzYzZTQzNzE1NzciLCJpYXQiOjE1ODE3MjYwMDN9.t5jVOwhnPdI6HIVDB3E4O7j8u5w2m-qtOF7O4Xk7AII" \
// -F operations='{ "query": "mutation ($file: Upload!, $name: String, $birthday: String) { createProfile(file: $file, name: $name, birthday: $birthday) { name } }", "variables": { "file": null, "name": "Murilo Andrade Medeiros", "birthday": "07-03-1994 08:45" } }' \
// -F map='{ "0": ["variables.file"] }' \
// -F 0=@tattoo.jpg

apolloServer.applyMiddleware({
  app: app
});
var httpServer = (0, _http.createServer)(app);
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen({
  port: 8080
}, function () {
  console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(8080, apolloServer.graphqlPath));
  console.log("\uD83D\uDE80 Subscriptions ready at ws://localhost:".concat(8080, apolloServer.subscriptionsPath));
});