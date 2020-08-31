"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = require("../user");

require('../../database');

jest.setTimeout(10000);
test('', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var user;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _user.registerUser)({
            password: '123123',
            email: 'day@gmail.com'
          });

        case 2:
          user = _context.sent;
          console.log(user);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));