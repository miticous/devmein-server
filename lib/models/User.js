"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _validator = _interopRequireDefault(require("validator"));

/* eslint-disable no-underscore-dangle */
var userSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: function validate(value) {
      if (!_validator["default"].isEmail(value)) {
        throw new Error({
          error: 'Invalid Email address'
        });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  token: {
    type: String,
    required: true
  },
  profileStatus: {
    type: String,
    "enum": ['PENDING', 'CREATION', 'COMPLETED'],
    required: true,
    "default": 'PENDING'
  },
  configs: {
    maxDistance: {
      type: Number,
      required: true,
      "default": 100
    },
    love: {
      range: [Number],
      genre: {
        type: String,
        "enum": ['WOMAN', 'MAN', 'ALL'],
        required: false
      }
    },
    friendShip: {
      range: [Number],
      genre: {
        type: String,
        "enum": ['WOMAN', 'MAN', 'ALL'],
        required: false
      }
    }
  }
});

var User = _mongoose["default"].model('User', userSchema);

var _default = User;
exports["default"] = _default;