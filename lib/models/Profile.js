"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.profileSchema = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _validator = _interopRequireDefault(require("validator"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _constants = require("../constants");

var _errorMessages = _interopRequireDefault(require("../constants/errorMessages"));

/* eslint-disable no-underscore-dangle */
var authorizedUserAge = function authorizedUserAge() {
  return (0, _momentTimezone["default"])(Date.now(), 'America/Sao_Paulo').subtract(_constants.AUTHORIZED_USER_AGE, 'year').add(1, 'day').toString();
};

var profileSchema = _mongoose["default"].Schema({
  _id: _mongoose["default"].Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  birthday: {
    type: Date,
    required: true,
    validate: function validate(value) {
      if (_validator["default"].isAfter(value.toString(), authorizedUserAge())) {
        throw new Error(_errorMessages["default"].USER_AGE_NOT_AUTHORIZED);
      }
    }
  },
  images: [{
    _id: _mongoose["default"].Schema.Types.ObjectId,
    image: {
      type: String,
      required: false
    }
  }],
  loc: {
    type: {
      type: String
    },
    coordinates: []
  },
  birthplace: {
    placeId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    lng: {
      type: String,
      required: true
    }
  },
  genre: {
    type: String,
    "enum": ['WOMAN', 'MAN', 'HUMAN'],
    required: true
  },
  sexualOrientations: [{
    type: String,
    "enum": ['HETERO', 'GAY', 'LESBIAN', 'BISEXUAL', 'ASEXUAL', 'DEMISEXUAL', 'PANSEXUAL', 'QUEER', 'QUESTIONING', 'OTHER'],
    required: true
  }],
  astral: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'Astral'
  },
  eyes: {
    type: String,
    required: true
  },
  graduation: {
    "class": {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    placeId: {
      type: String,
      required: true
    }
  },
  occupation: {
    type: String,
    required: true
  },
  residence: {
    description: {
      type: String,
      required: true
    },
    placeId: {
      type: String,
      required: true
    }
  }
});

exports.profileSchema = profileSchema;
profileSchema.index({
  loc: '2dsphere'
});

profileSchema.methods.addProfileImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(imageUrl) {
    var image;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            image = this.images[0];
            this.images = [{
              _id: image._id,
              image: imageUrl
            }];
            _context.next = 4;
            return this.save();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

var Profile = _mongoose["default"].model('Profile', profileSchema);

var _default = Profile;
exports["default"] = _default;