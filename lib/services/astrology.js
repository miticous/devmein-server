"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTexts = exports.getAstral = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var api = _axios["default"].create({
  baseURL: process.env.ASTROLOGY_API_URL,
  maxContentLength: 13290129312
});

var getAstral = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var name, latitude, longitude, birthdate, birthplaceFuso, _yield$api$post, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, latitude = _ref.latitude, longitude = _ref.longitude, birthdate = _ref.birthdate, birthplaceFuso = _ref.birthplaceFuso;
            _context.prev = 1;
            _context.next = 4;
            return api.post('/indices', {
              name: name,
              latitude: latitude,
              longitude: longitude,
              birthdate: birthdate,
              birthplace_fuso: birthplaceFuso,
              horaverao: 'false',
              placename: ''
            });

          case 4:
            _yield$api$post = _context.sent;
            data = _yield$api$post.data;
            console.log('Success on using astrology api INDICES');
            return _context.abrupt("return", data);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            console.log("Error on using astrology api INDICES ".concat(_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message));
            return _context.abrupt("return", false);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 10]]);
  }));

  return function getAstral(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getAstral = getAstral;

var getTexts = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var chartId, _yield$api$get, data;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            chartId = _ref3.chartId;
            _context2.prev = 1;
            _context2.next = 4;
            return api.get("/textos/".concat(chartId));

          case 4:
            _yield$api$get = _context2.sent;
            data = _yield$api$get.data;
            console.log('Success on using astrology api');
            console.log(data);
            return _context2.abrupt("return", {
              chartId: data === null || data === void 0 ? void 0 : data._id,
              texts: data === null || data === void 0 ? void 0 : data.texts
            });

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](1);
            console.log("Error on using astrology api ".concat(_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message));
            throw new Error(_context2.t0);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 11]]);
  }));

  return function getTexts(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getTexts = getTexts;