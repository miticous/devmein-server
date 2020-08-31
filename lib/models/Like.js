"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.likeSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

// THIS SCHEMA REPRESENTS ALL THE USERS WHOS LIKED ME
var likeSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  // SO, THIS WILL BE ME USERID
  likes: [{
    _id: _mongoose["default"].Schema.Types.ObjectId,
    type: {
      type: String,
      "enum": ['LOVE', 'FRIENDSHIP', 'BOTH'],
      required: true
    }
  }]
});

exports.likeSchema = likeSchema;

var Like = _mongoose["default"].model('Like', likeSchema);

var _default = Like;
exports["default"] = _default;