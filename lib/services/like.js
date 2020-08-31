"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLikesByUserId = exports.like = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Like = _interopRequireDefault(require("../models/Like"));

var _Profile = _interopRequireDefault(require("../models/Profile"));

var _match = require("./match");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var getLikeTypes = function getLikeTypes(_ref) {
  var userLikerLike = _ref.userLikerLike,
      userLikedLike = _ref.userLikedLike;

  var _userLikerLike$likes$ = userLikerLike.likes.find(function (like) {
    return like._id.toString() === userLikedLike._id.toString();
  }),
      userLikerLikeType = _userLikerLike$likes$.type;

  var _userLikedLike$likes$ = userLikedLike.likes.find(function (like) {
    return like._id.toString() === userLikerLike._id.toString();
  }),
      userLikedLikeType = _userLikedLike$likes$.type;

  return {
    userLikerLikeType: userLikerLikeType,
    userLikedLikeType: userLikedLikeType
  };
};

var updateLike = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref2) {
    var user, userLikedId, type, _yield$Like$findOne, likes, _likes$find, _type, userLikerLike;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = _ref2.user, userLikedId = _ref2.userLikedId, type = _ref2.type;
            _context.prev = 1;
            _context.next = 4;
            return _Like["default"].findOne({
              _id: user._id,
              'likes._id': userLikedId
            });

          case 4:
            _yield$Like$findOne = _context.sent;
            likes = _yield$Like$findOne.likes;
            _likes$find = likes.find(function (_like) {
              return _like._id.toString() === userLikedId;
            }), _type = _likes$find.type;

            if (!(_type === type || _type === 'BOTH')) {
              _context.next = 9;
              break;
            }

            throw new Error('An error occur while liking twice');

          case 9:
            if (!(_type !== type)) {
              _context.next = 14;
              break;
            }

            _context.next = 12;
            return _Like["default"].findOneAndUpdate({
              _id: user._id,
              'likes._id': userLikedId
            }, {
              $set: {
                'likes.$.type': 'BOTH',
                'likes.$._id': userLikedId
              }
            }, {
              "new": true,
              upsert: true
            });

          case 12:
            userLikerLike = _context.sent;
            return _context.abrupt("return", userLikerLike);

          case 14:
            return _context.abrupt("return", false);

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](1);
            throw new Error(_context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 17]]);
  }));

  return function updateLike(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var like = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref4) {
    var userLikedId, user, type, userLikedProfile, userLikerProfile, userLikedLike, userLikerLike, matchType, _userLikerLike, _matchType;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userLikedId = _ref4.userLikedId, user = _ref4.user, type = _ref4.type;

            if (!(userLikedId === user._id)) {
              _context2.next = 3;
              break;
            }

            throw new Error('Cannot like himself');

          case 3:
            _context2.next = 5;
            return _Profile["default"].findById(userLikedId);

          case 5:
            userLikedProfile = _context2.sent;
            _context2.next = 8;
            return _Profile["default"].findById(user._id);

          case 8:
            userLikerProfile = _context2.sent;

            if (!(!userLikedProfile || !userLikerProfile)) {
              _context2.next = 11;
              break;
            }

            throw new Error('An error occur while trying to get both profiles');

          case 11:
            _context2.next = 13;
            return _Like["default"].findOne({
              $and: [{
                _id: userLikedId
              }, {
                'likes._id': user === null || user === void 0 ? void 0 : user._id
              }]
            });

          case 13:
            userLikedLike = _context2.sent;
            _context2.prev = 14;
            _context2.next = 17;
            return _Like["default"].findOneAndUpdate({
              _id: user._id,
              'likes._id': {
                $ne: {
                  _id: userLikedId
                }
              }
            }, {
              $addToSet: {
                likes: {
                  _id: userLikedId,
                  type: type
                }
              }
            }, {
              "new": true,
              upsert: true
            });

          case 17:
            userLikerLike = _context2.sent;

            if (userLikedLike) {
              _context2.next = 20;
              break;
            }

            return _context2.abrupt("return", false);

          case 20:
            matchType = (0, _match.verifyMatch)(_objectSpread({}, getLikeTypes({
              userLikerLike: userLikerLike,
              userLikedLike: userLikedLike
            })));

            if (!matchType) {
              _context2.next = 23;
              break;
            }

            return _context2.abrupt("return", (0, _match.createMatch)({
              userLikedId: userLikedId,
              userLikerId: user._id,
              type: matchType,
              userLikedProfile: userLikedProfile
            }));

          case 23:
            return _context2.abrupt("return", false);

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](14);
            _context2.next = 30;
            return updateLike({
              user: user,
              userLikedId: userLikedId,
              type: type
            });

          case 30:
            _userLikerLike = _context2.sent;

            if (userLikedLike) {
              _context2.next = 33;
              break;
            }

            return _context2.abrupt("return", false);

          case 33:
            _matchType = (0, _match.verifyMatch)(_objectSpread({}, getLikeTypes({
              userLikerLike: _userLikerLike,
              userLikedLike: userLikedLike
            })));

            if (!_matchType) {
              _context2.next = 36;
              break;
            }

            return _context2.abrupt("return", (0, _match.createMatch)({
              userLikedId: userLikedId,
              userLikerId: user._id,
              type: _matchType,
              userLikedProfile: userLikedProfile
            }));

          case 36:
            return _context2.abrupt("return", false);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[14, 26]]);
  }));

  return function like(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.like = like;

var getLikesByUserId = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref6) {
    var userId, type, _yield$Like$findOne2, likes;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = _ref6.userId, type = _ref6.type;
            _context3.prev = 1;
            _context3.next = 4;
            return _Like["default"].findOne({
              _id: userId,
              'likes.type': {
                $in: [type, 'BOTH']
              }
            }, {
              'likes.$': 1,
              _id: 0
            });

          case 4:
            _yield$Like$findOne2 = _context3.sent;
            likes = _yield$Like$findOne2.likes;
            return _context3.abrupt("return", likes);

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](1);
            return _context3.abrupt("return", []);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 9]]);
  }));

  return function getLikesByUserId(_x3) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getLikesByUserId = getLikesByUserId;