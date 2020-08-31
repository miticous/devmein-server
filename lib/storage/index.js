"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _configs = require("./configs");

_firebaseAdmin["default"].initializeApp({
  credential: _firebaseAdmin["default"].credential.cert(_configs.config),
  storageBucket: 'jintou-d0ad5.appspot.com'
});

var _default = _firebaseAdmin["default"].storage().bucket();

exports["default"] = _default;