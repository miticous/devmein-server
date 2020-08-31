"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _like = require("../like");

jest.setTimeout(25000);

require('../../database');

test('Should like someone', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var user, userLikedId, match;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = {
            _id: '5e6861411c9d4400001195f6'
          };
          userLikedId = '5e684c78053c531368f25789';
          _context.next = 4;
          return (0, _like.like)({
            user: user,
            userLikedId: userLikedId
          });

        case 4:
          match = _context.sent;
          console.log(match);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));