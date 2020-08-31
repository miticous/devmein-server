"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datetimeToBrasiliaUtc = exports.formatUtcOffset = exports.getServerDate = exports.prepare = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../constants");

/* eslint-disable no-param-reassign */

/* eslint-disable no-underscore-dangle */
var prepare = function prepare(o) {
  o._id = o._id.toString();
  return o;
};

exports.prepare = prepare;

var getServerDate = function getServerDate() {
  return (0, _moment["default"])(Date.now()).subtract(_constants.CURRENT_SERVER_UTC, 'hours').toString();
};

exports.getServerDate = getServerDate;

var formatUtcOffset = function formatUtcOffset(offset) {
  var time = (0, _moment["default"])(offset, 'HH').format('HH:mm');

  if (offset < 0) {
    return "-".concat(time);
  }

  return time;
};

exports.formatUtcOffset = formatUtcOffset;

var datetimeToBrasiliaUtc = function datetimeToBrasiliaUtc(datetime) {
  return (0, _moment["default"])(datetime, 'DD/MM/YYYY HH:mm').utc().format();
};

exports.datetimeToBrasiliaUtc = datetimeToBrasiliaUtc;