"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeProfileImage = exports.addProfileImage = exports.updateProfileLocation = exports.getProfiles = exports.updateProfile = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apolloServerExpress = require("apollo-server-express");

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _moment = _interopRequireDefault(require("moment"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Profile = _interopRequireDefault(require("../models/Profile"));

var _storage = _interopRequireDefault(require("../storage"));

var _errorMessages = _interopRequireDefault(require("../constants/errorMessages"));

var _astrology = require("./astrology");

var _util = require("../util");

var _unlike = require("./unlike");

var _like = require("./like");

var _googleApis = require("./google-apis");

var _astral = require("./astral");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var uploadProfileImages = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var file, filename, tempPath;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            file = _ref.file, filename = _ref.filename;
            tempPath = _path["default"].join(__dirname, './', filename);
            _context.next = 4;
            return (0, _fs.writeFileSync)(tempPath, file, 'base64', function () {
              throw new _apolloServerExpress.ApolloError(_errorMessages["default"].TEMP_IMAGE_SAVE_FAILED);
            });

          case 4:
            _context.next = 6;
            return _storage["default"].upload(tempPath);

          case 6:
            _context.next = 8;
            return (0, _fs.unlinkSync)(tempPath, function (err) {
              if (err) {
                throw new _apolloServerExpress.ApolloError(_errorMessages["default"].TEMP_IMAGE_DELETE_FAILED);
              }

              return true;
            });

          case 8:
            return _context.abrupt("return", "https://firebasestorage.googleapis.com/v0/b/jintou-d0ad5.appspot.com/o/".concat(filename, "?alt=media&token"));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function uploadProfileImages(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var updateProfile = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(args) {
    var user, name, birthday, birthplace, occupation, eyes, genre, graduation, residence, sexualOrientations, _yield$getCitieById, lat, lng, UTC, placeId, formattedBirthDate, _yield$getAstral, chartId, zodiac, instinto, mandala, databaseChartId, _graduation$descripti, _residence$descriptio, profile;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = args.user, name = args.name, birthday = args.birthday, birthplace = args.birthplace, occupation = args.occupation, eyes = args.eyes, genre = args.genre, graduation = args.graduation, residence = args.residence, sexualOrientations = args.sexualOrientations;
            _context2.next = 3;
            return (0, _googleApis.getCitieById)(birthplace.placeId);

          case 3:
            _yield$getCitieById = _context2.sent;
            lat = _yield$getCitieById.lat;
            lng = _yield$getCitieById.lng;
            UTC = _yield$getCitieById.UTC;
            placeId = _yield$getCitieById.placeId;
            formattedBirthDate = (0, _util.datetimeToBrasiliaUtc)(birthday);
            _context2.next = 11;
            return (0, _astrology.getAstral)({
              name: name,
              birthdate: new Date(formattedBirthDate),
              latitude: lat,
              longitude: lng,
              birthplaceFuso: (0, _util.formatUtcOffset)(UTC)
            });

          case 11:
            _yield$getAstral = _context2.sent;
            chartId = _yield$getAstral.chart_id;
            zodiac = _yield$getAstral.zodiac;
            instinto = _yield$getAstral.instinto;
            mandala = _yield$getAstral.mandala;
            _context2.next = 18;
            return (0, _astral.updateAstral)({
              chartId: chartId,
              zodiac: zodiac,
              instinto: instinto,
              mandala: mandala
            });

          case 18:
            databaseChartId = _context2.sent;
            _context2.prev = 19;
            _context2.next = 22;
            return _Profile["default"].findOneAndUpdate({
              _id: user._id
            }, {
              name: name,
              birthday: new Date(formattedBirthDate),
              astral: databaseChartId,
              birthplace: {
                description: birthplace.description,
                placeId: placeId,
                lat: lat,
                lng: lng
              },
              occupation: occupation,
              eyes: eyes,
              sexualOrientations: sexualOrientations,
              genre: genre,
              graduation: _objectSpread(_objectSpread({}, graduation), {}, {
                placeId: (graduation === null || graduation === void 0 ? void 0 : (_graduation$descripti = graduation.description) === null || _graduation$descripti === void 0 ? void 0 : _graduation$descripti.length) === 0 ? null : graduation === null || graduation === void 0 ? void 0 : graduation.placeId
              }),
              residence: _objectSpread(_objectSpread({}, residence), {}, {
                placeId: (residence === null || residence === void 0 ? void 0 : (_residence$descriptio = residence.description) === null || _residence$descriptio === void 0 ? void 0 : _residence$descriptio.length) === 0 ? null : residence === null || residence === void 0 ? void 0 : residence.placeId
              })
            }, {
              "new": true,
              upsert: true
            });

          case 22:
            profile = _context2.sent;
            return _context2.abrupt("return", profile);

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](19);
            throw new _apolloServerExpress.ApolloError(_context2.t0);

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[19, 26]]);
  }));

  return function updateProfile(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateProfile = updateProfile;

var getWantedGenres = function getWantedGenres(_ref4) {
  var userFavoriteGenre = _ref4.userFavoriteGenre;

  if (userFavoriteGenre === 'ALL') {
    return ['MAN', 'WOMAN', 'HUMAN'];
  }

  return [userFavoriteGenre];
};

var getProfiles = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref5) {
    var user, searchType, _id, _user$configs, maxDistance, love, friendShip, _yield$Profile$findOn, coordinates, profilesUnlikedByUser, profilesLikedByUser, wantedGenres, startAge, endAge, startBirthday, endBirthDay, profiles;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = _ref5.user, searchType = _ref5.searchType;
            _id = user._id, _user$configs = user.configs, maxDistance = _user$configs.maxDistance, love = _user$configs.love, friendShip = _user$configs.friendShip;
            _context3.next = 4;
            return _Profile["default"].findOne({
              _id: user._id
            }, {
              loc: 1,
              _id: 0
            });

          case 4:
            _yield$Profile$findOn = _context3.sent;
            coordinates = _yield$Profile$findOn.loc.coordinates;
            _context3.next = 8;
            return (0, _unlike.getUnlikesByUserId)({
              userId: _id,
              type: searchType
            });

          case 8:
            profilesUnlikedByUser = _context3.sent;
            _context3.next = 11;
            return (0, _like.getLikesByUserId)({
              userId: _id,
              type: searchType
            });

          case 11:
            profilesLikedByUser = _context3.sent;
            wantedGenres = getWantedGenres({
              userFavoriteGenre: searchType === 'LOVE' ? love.genre : friendShip.genre
            });
            startAge = searchType === 'LOVE' ? love.range[0] : friendShip.range[0];
            endAge = searchType === 'LOVE' ? love.range[1] : friendShip.range[1];
            startBirthday = (0, _moment["default"])().subtract(startAge, 'years').toISOString();
            endBirthDay = (0, _moment["default"])().subtract(endAge, 'years').toISOString();
            _context3.next = 19;
            return _Profile["default"].find({
              $and: [{
                _id: {
                  $nin: [].concat((0, _toConsumableArray2["default"])(profilesUnlikedByUser), (0, _toConsumableArray2["default"])(profilesLikedByUser), [_id])
                }
              }, {
                loc: {
                  $near: {
                    $geometry: {
                      type: 'Point',
                      coordinates: coordinates
                    },
                    $maxDistance: maxDistance * 1110.12
                  }
                }
              }, {
                genre: {
                  $in: (0, _toConsumableArray2["default"])(wantedGenres)
                }
              }, {
                birthday: {
                  $gte: endBirthDay,
                  $lt: startBirthday
                }
              }]
            }).populate({
              path: 'astral',
              model: 'Astral'
            }).exec();

          case 19:
            profiles = _context3.sent;
            return _context3.abrupt("return", profiles);

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getProfiles(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getProfiles = getProfiles;

var updateProfileLocation = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref7) {
    var latitude, longitude, userId;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            latitude = _ref7.latitude, longitude = _ref7.longitude, userId = _ref7.userId;
            _context4.next = 3;
            return _Profile["default"].findOneAndUpdate({
              _id: userId
            }, {
              loc: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              }
            }, {
              "new": true,
              upsert: true
            });

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateProfileLocation(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.updateProfileLocation = updateProfileLocation;

var addProfileImage = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref9) {
    var user, file, imageId, imageName, imageLink;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            user = _ref9.user, file = _ref9.file;
            imageId = new _mongoose["default"].Types.ObjectId();
            imageName = "".concat(user._id, ".").concat(imageId, ".png");
            imageLink = "https://firebasestorage.googleapis.com/v0/b/jintou-d0ad5.appspot.com/o/".concat(imageName, "?alt=media&token");
            _context5.prev = 4;
            _context5.next = 7;
            return uploadProfileImages({
              file: file,
              filename: imageName
            });

          case 7:
            _context5.next = 9;
            return _Profile["default"].findOneAndUpdate({
              _id: user._id
            }, {
              $addToSet: {
                images: {
                  _id: imageId,
                  image: imageLink
                }
              }
            }, {
              "new": true,
              upsert: true
            });

          case 9:
            return _context5.abrupt("return", true);

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](4);
            _context5.next = 16;
            return _Profile["default"].findOneAndUpdate({
              _id: user._id
            }, {
              $pull: {
                images: {
                  _id: imageId,
                  image: imageLink
                }
              }
            }, {
              "new": true,
              upsert: true
            });

          case 16:
            _context5.next = 18;
            return _storage["default"].file(imageName)["delete"]();

          case 18:
            return _context5.abrupt("return", false);

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 12]]);
  }));

  return function addProfileImage(_x5) {
    return _ref10.apply(this, arguments);
  };
}();

exports.addProfileImage = addProfileImage;

var removeProfileImage = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref11) {
    var user, imageId, _yield$Profile$findOn2, images, isUserImageOwner, imageName;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            user = _ref11.user, imageId = _ref11.imageId;
            _context6.next = 3;
            return _Profile["default"].findOne({
              _id: user._id
            });

          case 3:
            _yield$Profile$findOn2 = _context6.sent;
            images = _yield$Profile$findOn2.images;
            isUserImageOwner = images.find(function (image) {
              return image.image.includes(user._id);
            });
            imageName = "".concat(user._id, ".").concat(imageId, ".png");
            _context6.prev = 7;

            if (!isUserImageOwner) {
              _context6.next = 14;
              break;
            }

            _context6.next = 11;
            return _Profile["default"].findOneAndUpdate({
              _id: user._id
            }, {
              $pull: {
                images: {
                  _id: imageId
                }
              }
            }, {
              "new": true,
              upsert: true
            });

          case 11:
            _context6.next = 13;
            return _storage["default"].file(imageName)["delete"]();

          case 13:
            return _context6.abrupt("return", true);

          case 14:
            _context6.next = 19;
            break;

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](7);
            return _context6.abrupt("return", false);

          case 19:
            return _context6.abrupt("return", false);

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[7, 16]]);
  }));

  return function removeProfileImage(_x6) {
    return _ref12.apply(this, arguments);
  };
}();

exports.removeProfileImage = removeProfileImage;