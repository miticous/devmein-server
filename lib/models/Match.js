"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _util = require("../util");

var matchSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false,
    "default": function _default() {
      return (0, _util.getServerDate)();
    }
  },
  matches: [{
    _id: _mongoose["default"].Schema.Types.ObjectId
  }],
  unreadMessages: {
    type: Number,
    required: true,
    "default": 0
  },
  lastMessage: {
    senderId: {
      type: String,
      required: false
    },
    receiverId: {
      type: String,
      required: false
    },
    sentAt: {
      type: Date,
      required: false
    },
    text: {
      type: String,
      required: false
    }
  },
  type: {
    type: String,
    "enum": ['LOVE', 'FRIENDSHIP', 'BOTH'],
    required: true
  }
});

matchSchema.pre('save', function () {
  if (!this._id) {
    var id = new _mongoose["default"].Types.ObjectId();
    this._id = id;
  }
});

var Match = _mongoose["default"].model('Match', matchSchema);

var _default2 = Match;
exports["default"] = _default2;