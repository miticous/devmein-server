"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Profile = _interopRequireDefault(require("../../models/Profile"));

var _match = require("../match");

require('../../database');

jest.setTimeout(15000);
describe('Testing match', function () {
  var userLikedId = '5e66752e7908a379ff3f1445';
  var userLikerId = '5e684c78053c531368f25789';
  it('Should create a new match', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var userLikedProfile, userLikerProfile, newMatch;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Profile["default"].findOne({
              _id: userLikedId
            });

          case 2:
            userLikedProfile = _context.sent;
            _context.next = 5;
            return _Profile["default"].findOne({
              _id: userLikerId
            });

          case 5:
            userLikerProfile = _context.sent;
            _context.next = 8;
            return (0, _match.createMatch)({
              userLikerProfile: userLikerProfile,
              userLikedProfile: userLikedProfile
            });

          case 8:
            newMatch = _context.sent;
            console.log(newMatch);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});