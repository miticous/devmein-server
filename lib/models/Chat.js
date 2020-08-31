"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.chatSchema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _util = require("../util");

var chatSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  startedAt: {
    type: Date,
    required: false,
    "default": function _default() {
      return (0, _util.getServerDate)();
    }
  },
  participants: [{
    _id: _mongoose["default"].Schema.Types.ObjectId
  }],
  messages: [{
    senderId: {
      type: String,
      required: true
    },
    receiverId: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      required: true,
      "default": function _default() {
        return (0, _util.getServerDate)();
      }
    },
    text: {
      type: String,
      required: true
    },
    viewed: {
      type: Boolean,
      required: true,
      "default": false
    }
  }]
});

exports.chatSchema = chatSchema;
chatSchema.pre('save', function () {
  var _this = this;

  this.messages = this.messages.map(function (message, index) {
    if (!_this.messages[index]._id) {
      _this.messages[index]._id = new _mongoose["default"].Types.ObjectId();
    }

    return _this.message[index];
  });
});

var Chat = _mongoose["default"].model('Chat', chatSchema);

var _default2 = Chat;
exports["default"] = _default2;