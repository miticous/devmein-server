"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _unlike = require("../unlike");

jest.setTimeout(25000);

require('../../database'); // test('should unlike someone whitout duplicate like', async () => {
//   const user = {
//     _id: '5e684c78053c531368f25789'
//   };
//   const userUnlikedId = '5e66752e7908a379ff3f1445';
//   try {
//     const unliked = await unlike({ user, userUnlikedId });
//     console.log(unliked);
//   } catch (error) {}
// });


test('should get unliked profiles by user id', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var userId, unlikedProfiles;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = '5e684c78053c531368f25789';
          _context.next = 3;
          return (0, _unlike.getUnlikesByUserId)({
            userId: userId
          });

        case 3:
          unlikedProfiles = _context.sent;
          console.log(unlikedProfiles);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));