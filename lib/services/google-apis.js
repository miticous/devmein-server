"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCitieById = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var getCitieById = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(placeId) {
    var key, _yield$Axios, _yield$Axios$data$res, _yield$Axios$data$res2, lat, lng, UTCOffset, UTCFromMinutesToHours;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = 'AIzaSyAsceWUlXxulQJohZddfRPstfcNl7FcE2s';
            _context.next = 3;
            return (0, _axios["default"])({
              method: 'GET',
              url: "https://maps.googleapis.com/maps/api/place/details/json?key=".concat(key, "&placeid=").concat(placeId, "&language=pt-BR&fields=geometry,utc_offset")
            });

          case 3:
            _yield$Axios = _context.sent;
            _yield$Axios$data$res = _yield$Axios.data.result;
            _yield$Axios$data$res2 = _yield$Axios$data$res.geometry.location;
            lat = _yield$Axios$data$res2.lat;
            lng = _yield$Axios$data$res2.lng;
            UTCOffset = _yield$Axios$data$res.utc_offset;
            UTCFromMinutesToHours = UTCOffset / 60;
            return _context.abrupt("return", {
              placeId: placeId,
              lat: lat.toString(),
              lng: lng.toString(),
              UTC: UTCFromMinutesToHours.toString()
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getCitieById(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getCitieById = getCitieById;