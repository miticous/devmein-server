"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAstral = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Astral = _interopRequireDefault(require("../models/Astral"));

var _astrology = require("./astrology");

var updateAstral = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var chartId, zodiac, instinto, mandala, _yield$getTexts, _chartId, texts, astral;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            chartId = _ref.chartId, zodiac = _ref.zodiac, instinto = _ref.instinto, mandala = _ref.mandala;
            _context.next = 3;
            return (0, _astrology.getTexts)({
              chartId: chartId
            });

          case 3:
            _yield$getTexts = _context.sent;
            _chartId = _yield$getTexts.chartId;
            texts = _yield$getTexts.texts;
            _context.prev = 6;
            _context.next = 9;
            return _Astral["default"].findOneAndUpdate({
              chartId: _chartId
            }, {
              texts: texts,
              zodiac: zodiac,
              indexes: instinto,
              mandala: mandala
            }, {
              "new": true,
              upsert: true
            });

          case 9:
            astral = _context.sent;
            return _context.abrupt("return", astral === null || astral === void 0 ? void 0 : astral._id);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](6);
            throw new Error(_context.t0);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 13]]);
  }));

  return function updateAstral(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateAstral = updateAstral;