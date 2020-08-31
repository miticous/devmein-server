"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _profile = require("../profile");

jest.setTimeout(25000);

require('../../database');

test('Should get profiles to home with existing userId', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var user, profiles;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = {
            _id: '5e684c78053c531368f25789',
            configs: {
              searchGenre: 'FEMALE',
              maxDistance: 100
            }
          };
          _context.next = 3;
          return (0, _profile.getProfilesToHome)({
            user: user
          });

        case 3:
          profiles = _context.sent;
          console.log(profiles);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));