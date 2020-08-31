"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _names = require("../__mocks__/names");

function capFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var generateName = function generateName() {
  var name = "".concat(capFirst(_names.names1[getRandomInt(0, _names.names1.length + 1)]), " ").concat(capFirst(_names.names2[getRandomInt(0, _names.names2.length + 1)]));
  return name;
};

var _default = generateName;
exports["default"] = _default;