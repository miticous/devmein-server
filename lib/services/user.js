"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveUserConfig = exports.logout = exports.auth = exports.login = exports.registerUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _User = _interopRequireDefault(require("../models/User"));

var _errorMessages = _interopRequireDefault(require("../constants/errorMessages"));

var _Profile = _interopRequireDefault(require("../models/Profile"));

/* eslint-disable no-underscore-dangle */
var registerUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(args) {
    var encryptedPassword, user, id, _user, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _bcryptjs["default"].hash(args.password.toString(), 8);

          case 3:
            encryptedPassword = _context.sent;
            _context.next = 6;
            return _User["default"].findOne({
              email: args.email
            });

          case 6:
            user = _context.sent;

            if (!user) {
              _context.next = 9;
              break;
            }

            throw new Error('User already exists');

          case 9:
            id = new _mongoose["default"].Types.ObjectId();
            _user = new _User["default"]({
              _id: id,
              email: args.email,
              password: encryptedPassword,
              token: _jsonwebtoken["default"].sign({
                _id: id
              }, process.env.JWT_KEY)
            });
            _context.next = 13;
            return _user.save();

          case 13:
            data = _context.sent;
            return _context.abrupt("return", data);

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            throw new Error(_context.t0.message);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 17]]);
  }));

  return function registerUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.registerUser = registerUser;

var login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(args) {
    var user, isValidPassword, updatedUser, profileStatus, _id, name, email, token;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _User["default"].findOne({
              email: args.email
            });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 5;
              break;
            }

            throw _errorMessages["default"].INVALID_EMAIL_OR_PASSWORD;

          case 5:
            _context2.next = 7;
            return _bcryptjs["default"].compare(args.password.toString(), user.password.toString());

          case 7:
            isValidPassword = _context2.sent;

            if (isValidPassword) {
              _context2.next = 10;
              break;
            }

            throw _errorMessages["default"].INVALID_EMAIL_OR_PASSWORD;

          case 10:
            _context2.next = 12;
            return _User["default"].findByIdAndUpdate(user._id, {
              token: _jsonwebtoken["default"].sign({
                _id: user._id
              }, process.env.JWT_KEY)
            }, {
              "new": true
            });

          case 12:
            updatedUser = _context2.sent;
            profileStatus = updatedUser.profileStatus, _id = updatedUser._id, name = updatedUser.name, email = updatedUser.email, token = updatedUser.token;
            return _context2.abrupt("return", {
              _id: _id,
              name: name,
              email: email,
              token: token,
              profileStatus: profileStatus
            });

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function login(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.login = login;

var auth = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
    var userId, token, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = _ref3.userId, token = _ref3.token;
            _context3.next = 3;
            return _User["default"].findOne({
              _id: userId,
              token: token
            });

          case 3:
            user = _context3.sent;

            if (user) {
              _context3.next = 6;
              break;
            }

            throw _errorMessages["default"].AUTHENTICATION_FAILED;

          case 6:
            return _context3.abrupt("return", user.profileStatus);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function auth(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.auth = auth;

var logout = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(token) {
    var data, user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (token) {
              _context4.next = 2;
              break;
            }

            throw _errorMessages["default"].LOGOUT_FAILED;

          case 2:
            data = _jsonwebtoken["default"].verify(token, process.env.JWT_KEY);

            if (data) {
              _context4.next = 5;
              break;
            }

            throw _errorMessages["default"].LOGOUT_FAILED;

          case 5:
            _context4.next = 7;
            return _User["default"].findByIdAndUpdate(data._id, {
              token: null
            }, {
              "new": true
            });

          case 7:
            user = _context4.sent;

            if (user) {
              _context4.next = 10;
              break;
            }

            throw _errorMessages["default"].LOGOUT_FAILED;

          case 10:
            return _context4.abrupt("return", true);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function logout(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.logout = logout;

var saveUserConfig = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref6) {
    var user, maxDistance, searchLoveAgeRange, searchFriendAgeRange, searchLoveGenre, searchFriendGenre, profileStatus;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            user = _ref6.user, maxDistance = _ref6.maxDistance, searchLoveAgeRange = _ref6.searchLoveAgeRange, searchFriendAgeRange = _ref6.searchFriendAgeRange, searchLoveGenre = _ref6.searchLoveGenre, searchFriendGenre = _ref6.searchFriendGenre, profileStatus = _ref6.profileStatus;
            _context5.prev = 1;
            _context5.next = 4;
            return _Profile["default"].findOne({
              _id: user._id
            });

          case 4:
            _context5.next = 6;
            return _User["default"].findOneAndUpdate({
              _id: user._id
            }, {
              $set: {
                'configs.love.range': searchLoveAgeRange,
                'configs.friendShip.range': searchFriendAgeRange,
                'configs.love.genre': searchLoveGenre,
                'configs.friendShip.genre': searchFriendGenre,
                'configs.maxDistance': maxDistance || 100
              },
              profileStatus: profileStatus
            });

          case 6:
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            throw new Error(_context5.t0);

          case 11:
            return _context5.abrupt("return", true);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 8]]);
  }));

  return function saveUserConfig(_x5) {
    return _ref7.apply(this, arguments);
  };
}();

exports.saveUserConfig = saveUserConfig;