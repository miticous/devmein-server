"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.astralSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var astralSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  chartId: {
    type: String,
    required: true
  },
  indexes: {
    type: String,
    required: true
  },
  zodiac: {
    type: String,
    required: true
  },
  mandala: {
    type: String,
    required: true
  },
  texts: [{
    text: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    }
  }]
});

exports.astralSchema = astralSchema;

var Astral = _mongoose["default"].model('Astral', astralSchema);

var _default = Astral;
exports["default"] = _default;