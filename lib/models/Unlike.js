"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.unlikeSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var unlikeSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  unlikes: [{
    _id: _mongoose["default"].Schema.Types.ObjectId,
    type: {
      type: String,
      "enum": ['LOVE', 'FRIENDSHIP', 'BOTH'],
      required: true
    }
  }]
});

exports.unlikeSchema = unlikeSchema;

var Unlike = _mongoose["default"].model('Unlike', unlikeSchema);

var _default = Unlike;
exports["default"] = _default;