"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _astrology = require("../astrology");

var _util = require("../../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

describe('tests services from astrology', function () {
  var mockPersonData = {
    name: 'Murilo',
    latitude: '-16.6782694',
    longitude: '-49.3233247',
    birthdate: new Date((0, _util.datetimeToBrasiliaUtc)('07/03/1994 08:45')),
    birthplace_fuso: (0, _util.formatUtcOffset)('-3'),
    horaverao: 'false',
    placename: ''
  };
  it('should format fuso', function () {
    var number = '-3';
    expect((0, _util.formatUtcOffset)(number)).toEqual('-03:00');
    expect((0, _util.formatUtcOffset)(number * -1)).toEqual('03:00');
  });
  it('should return indexes from astrology method', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var indexes;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _astrology.getAstralMapIndexes)(_objectSpread(_objectSpread({}, mockPersonData), {}, {
              birthplaceFuso: mockPersonData.birthplace_fuso
            }));

          case 3:
            indexes = _context.sent;
            expect(indexes.length).toBeGreaterThan(1);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  })));
});