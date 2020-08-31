"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _profile2 = require("../services/profile");

var _Profile = _interopRequireDefault(require("../models/Profile"));

var _chat2 = require("../services/chat");

var _like = require("../services/like");

var _unlike = require("../services/unlike");

var _user3 = require("../services/user");

var _match = require("../services/match");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var NEW_MESSAGE = 'NEW_MESSAGE';
var resolvers = {
  Subscription: {
    newMessage: {
      subscribe: function subscribe(_, __, _ref) {
        var pubsub = _ref.pubsub;
        return pubsub.asyncIterator([NEW_MESSAGE]);
      }
    }
  },
  Query: {
    user: function () {
      var _user2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_, __, _ref2) {
        var _user, configs, profileStatus;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _user = _ref2.user;
                configs = _user.configs, profileStatus = _user.profileStatus;
                return _context.abrupt("return", {
                  configs: configs,
                  profileStatus: profileStatus
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function user(_x, _x2, _x3) {
        return _user2.apply(this, arguments);
      }

      return user;
    }(),
    profile: function () {
      var _profile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, __, _ref3) {
        var _id, profile;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _id = _ref3.user._id;
                _context2.next = 3;
                return _Profile["default"].findById(_id).populate({
                  path: 'astral',
                  model: 'Astral'
                });

              case 3:
                profile = _context2.sent;

                if (profile) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", {});

              case 6:
                return _context2.abrupt("return", profile);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function profile(_x4, _x5, _x6) {
        return _profile.apply(this, arguments);
      }

      return profile;
    }(),
    profiles: function () {
      var _profiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_, _ref4, _ref5) {
        var searchType, user, profiles;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                searchType = _ref4.searchType;
                user = _ref5.user;
                _context3.next = 4;
                return (0, _profile2.getProfiles)({
                  user: user,
                  searchType: searchType
                });

              case 4:
                profiles = _context3.sent;
                return _context3.abrupt("return", profiles);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function profiles(_x7, _x8, _x9) {
        return _profiles.apply(this, arguments);
      }

      return profiles;
    }(),
    chat: function () {
      var _chat = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_, _ref6, _ref7) {
        var matchId, user, chat;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                matchId = _ref6.matchId;
                user = _ref7.user;
                _context4.next = 4;
                return (0, _chat2.getChat)({
                  chatId: matchId,
                  user: user
                });

              case 4:
                chat = _context4.sent;
                return _context4.abrupt("return", chat);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function chat(_x10, _x11, _x12) {
        return _chat.apply(this, arguments);
      }

      return chat;
    }(),
    matches: function () {
      var _matches = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_, __, _ref8) {
        var _id, matches;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _id = _ref8.user._id;
                _context5.next = 3;
                return (0, _match.getMatchesByUserId)({
                  userId: _id
                });

              case 3:
                matches = _context5.sent;
                return _context5.abrupt("return", matches);

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function matches(_x13, _x14, _x15) {
        return _matches.apply(this, arguments);
      }

      return matches;
    }()
  },
  Mutation: {
    editProfile: function () {
      var _editProfile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_, args, _ref9) {
        var user, profile;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                user = _ref9.user;
                _context6.next = 3;
                return (0, _profile2.updateProfile)(_objectSpread({
                  user: user
                }, args));

              case 3:
                profile = _context6.sent;
                return _context6.abrupt("return", profile);

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function editProfile(_x16, _x17, _x18) {
        return _editProfile.apply(this, arguments);
      }

      return editProfile;
    }(),
    sendMessage: function () {
      var _sendMessage2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_, _ref10, _ref11) {
        var matchId, message, user, pubsub, chat;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                matchId = _ref10.matchId, message = _ref10.message;
                user = _ref11.user, pubsub = _ref11.pubsub;
                _context7.next = 4;
                return (0, _chat2.sendMessage)({
                  matchId: matchId,
                  sender: user,
                  message: message
                });

              case 4:
                chat = _context7.sent;
                _context7.next = 7;
                return pubsub.publish(NEW_MESSAGE, {
                  newMessage: chat
                });

              case 7:
                return _context7.abrupt("return", chat);

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function sendMessage(_x19, _x20, _x21) {
        return _sendMessage2.apply(this, arguments);
      }

      return sendMessage;
    }(),
    likeSomeone: function () {
      var _likeSomeone = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_, _ref12, _ref13) {
        var userLikedId, type, user, match;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                userLikedId = _ref12.userLikedId, type = _ref12.type;
                user = _ref13.user;
                _context8.next = 4;
                return (0, _like.like)({
                  userLikedId: userLikedId,
                  user: user,
                  type: type
                });

              case 4:
                match = _context8.sent;
                return _context8.abrupt("return", match);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function likeSomeone(_x22, _x23, _x24) {
        return _likeSomeone.apply(this, arguments);
      }

      return likeSomeone;
    }(),
    unlikeSomeone: function () {
      var _unlikeSomeone = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_, _ref14, _ref15) {
        var userUnlikedId, type, user;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                userUnlikedId = _ref14.userUnlikedId, type = _ref14.type;
                user = _ref15.user;
                _context9.next = 4;
                return (0, _unlike.unlike)({
                  user: user,
                  userUnlikedId: userUnlikedId,
                  type: type
                });

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function unlikeSomeone(_x25, _x26, _x27) {
        return _unlikeSomeone.apply(this, arguments);
      }

      return unlikeSomeone;
    }(),
    sendGeoLocation: function () {
      var _sendGeoLocation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_, args, _ref16) {
        var _id;

        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _id = _ref16.user._id;
                _context10.next = 3;
                return (0, _profile2.updateProfileLocation)(_objectSpread(_objectSpread({}, args), {}, {
                  userId: _id
                }));

              case 3:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function sendGeoLocation(_x28, _x29, _x30) {
        return _sendGeoLocation.apply(this, arguments);
      }

      return sendGeoLocation;
    }(),
    saveUserConfigs: function () {
      var _saveUserConfigs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(_, data, _ref17) {
        var user;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                user = _ref17.user;
                _context11.next = 3;
                return (0, _user3.saveUserConfig)(_objectSpread(_objectSpread({}, data), {}, {
                  user: user
                }));

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function saveUserConfigs(_x31, _x32, _x33) {
        return _saveUserConfigs.apply(this, arguments);
      }

      return saveUserConfigs;
    }(),
    addProfileImage: function () {
      var _addProfileImage2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(_, _ref18, _ref19) {
        var file, user;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                file = _ref18.file;
                user = _ref19.user;
                _context12.next = 4;
                return (0, _profile2.addProfileImage)({
                  file: file,
                  user: user
                });

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function addProfileImage(_x34, _x35, _x36) {
        return _addProfileImage2.apply(this, arguments);
      }

      return addProfileImage;
    }(),
    removeProfileImage: function () {
      var _removeProfileImage2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(_, _ref20, _ref21) {
        var imageId, user;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                imageId = _ref20.imageId;
                user = _ref21.user;
                _context13.next = 4;
                return (0, _profile2.removeProfileImage)({
                  imageId: imageId,
                  user: user
                });

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function removeProfileImage(_x37, _x38, _x39) {
        return _removeProfileImage2.apply(this, arguments);
      }

      return removeProfileImage;
    }()
  }
};
var _default = resolvers;
exports["default"] = _default;