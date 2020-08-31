"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchesByUserId = exports.createMatch = exports.verifyMatch = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Match = _interopRequireDefault(require("../models/Match"));

var _Profile = _interopRequireDefault(require("../models/Profile"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var verifyMatch = function verifyMatch(_ref) {
  var userLikerLikeType = _ref.userLikerLikeType,
      userLikedLikeType = _ref.userLikedLikeType;

  if (userLikedLikeType === userLikerLikeType) {
    return userLikedLikeType;
  }

  if (userLikedLikeType === 'BOTH' || userLikerLikeType === 'BOTH') {
    var matchType = [userLikerLikeType, userLikedLikeType].find(function (type) {
      return type !== 'BOTH';
    });
    return matchType;
  }

  return null;
};

exports.verifyMatch = verifyMatch;

var createMatch = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref2) {
    var userLikedId, userLikerId, type, userLikedProfile, match, _match2, _match;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userLikedId = _ref2.userLikedId, userLikerId = _ref2.userLikerId, type = _ref2.type, userLikedProfile = _ref2.userLikedProfile;
            _context.next = 3;
            return _Match["default"].findOne({
              $and: [{
                'matches._id': userLikedId
              }, {
                'matches._id': userLikerId
              }]
            });

          case 3:
            match = _context.sent;

            if (!match) {
              _context.next = 9;
              break;
            }

            _context.next = 7;
            return _Match["default"].findOneAndUpdate({
              _id: match._id
            }, {
              type: type
            }, {
              "new": true
            });

          case 7:
            _match2 = _context.sent;
            return _context.abrupt("return", _match2);

          case 9:
            _match = new _Match["default"]({
              matches: [{
                _id: userLikerId
              }, {
                _id: userLikedId
              }],
              type: type
            });
            _context.next = 12;
            return _match.save();

          case 12:
            return _context.abrupt("return", userLikedProfile);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createMatch(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.createMatch = createMatch;

var getMatchesByUserId = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref4) {
    var userId, userMatches, _userMatches, i, matchedId, profiledMatched;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userId = _ref4.userId;
            _context2.prev = 1;
            _context2.next = 4;
            return _Match["default"].find({
              'matches._id': userId
            });

          case 4:
            userMatches = _context2.sent;
            _userMatches = [];
            i = 0;

          case 7:
            if (!(i < userMatches.length)) {
              _context2.next = 16;
              break;
            }

            matchedId = userMatches[i].matches.find(function (_match) {
              return _match._id.toString() !== userId.toString();
            });
            _context2.next = 11;
            return _Profile["default"].findOne({
              _id: matchedId
            });

          case 11:
            profiledMatched = _context2.sent;

            _userMatches.push(_objectSpread(_objectSpread({}, userMatches[i].toObject()), {}, {
              profileMatched: profiledMatched.toObject()
            }));

          case 13:
            i += 1;
            _context2.next = 7;
            break;

          case 16:
            return _context2.abrupt("return", _userMatches);

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](1);
            throw new Error(_context2.t0);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 19]]);
  }));

  return function getMatchesByUserId(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getMatchesByUserId = getMatchesByUserId;