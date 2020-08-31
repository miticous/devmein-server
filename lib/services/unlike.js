"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnlikesByUserId = exports.unlike = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Profile = _interopRequireDefault(require("../models/Profile"));

var _Unlike = _interopRequireDefault(require("../models/Unlike"));

var updateUnlike = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var user, userUnlikedId, type, _yield$Unlike$findOne, unlikes, _unlikes$find, _type;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = _ref.user, userUnlikedId = _ref.userUnlikedId, type = _ref.type;
            _context.prev = 1;
            _context.next = 4;
            return _Unlike["default"].findOne({
              _id: user._id,
              'unlikes._id': userUnlikedId
            });

          case 4:
            _yield$Unlike$findOne = _context.sent;
            unlikes = _yield$Unlike$findOne.unlikes;
            _unlikes$find = unlikes.find(function (_unlike) {
              return _unlike._id.toString() === userUnlikedId;
            }), _type = _unlikes$find.type;

            if (!(_type === type || _type === 'BOTH')) {
              _context.next = 9;
              break;
            }

            throw new Error('An error occur while unliking twice');

          case 9:
            if (!(_type !== type)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", _Unlike["default"].findOneAndUpdate({
              _id: user._id,
              'unlikes._id': userUnlikedId
            }, {
              $set: {
                'unlikes.$.type': 'BOTH',
                'unlikes.$._id': userUnlikedId
              }
            }, {
              "new": true,
              upsert: true
            }));

          case 11:
            return _context.abrupt("return", false);

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            throw new Error(_context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 14]]);
  }));

  return function updateUnlike(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var unlike = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var user, userUnlikedId, type, userUnlikedProfile;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = _ref3.user, userUnlikedId = _ref3.userUnlikedId, type = _ref3.type;
            _context2.next = 3;
            return _Profile["default"].findOne({
              _id: userUnlikedId
            });

          case 3:
            userUnlikedProfile = _context2.sent;

            if (userUnlikedProfile) {
              _context2.next = 6;
              break;
            }

            throw new Error('User unliked does not exists');

          case 6:
            _context2.prev = 6;
            _context2.next = 9;
            return _Unlike["default"].findOneAndUpdate({
              _id: user._id,
              'unlikes._id': {
                $ne: {
                  _id: userUnlikedId
                }
              }
            }, {
              $addToSet: {
                unlikes: {
                  _id: userUnlikedId,
                  type: type
                }
              }
            }, {
              "new": true,
              upsert: true
            });

          case 9:
            return _context2.abrupt("return", true);

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](6);
            return _context2.abrupt("return", updateUnlike({
              user: user,
              userUnlikedId: userUnlikedId,
              type: type
            }));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 12]]);
  }));

  return function unlike(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.unlike = unlike;

var getUnlikesByUserId = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref5) {
    var userId, type, _yield$Unlike$findOne2, unlikes;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = _ref5.userId, type = _ref5.type;
            _context3.prev = 1;
            _context3.next = 4;
            return _Unlike["default"].findOne({
              _id: userId,
              'unlikes.type': {
                $in: [type, 'BOTH']
              }
            }, {
              'unlikes.$': 1,
              _id: 0
            });

          case 4:
            _yield$Unlike$findOne2 = _context3.sent;
            unlikes = _yield$Unlike$findOne2.unlikes;
            return _context3.abrupt("return", unlikes);

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

  return function getUnlikesByUserId(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getUnlikesByUserId = getUnlikesByUserId;