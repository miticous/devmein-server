"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChat = exports.sendMessage = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Chat = _interopRequireDefault(require("../models/Chat"));

var _Match = _interopRequireDefault(require("../models/Match"));

var _util = require("../util");

var _Profile = _interopRequireDefault(require("../models/Profile"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var sendMessage = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var _chat$messages;

    var matchId, sender, message, match, _match$matches$find, receiverId, serverDate, newMessage, chat, unreadMessagesCount;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            matchId = _ref.matchId, sender = _ref.sender, message = _ref.message;
            _context.next = 3;
            return _Match["default"].findOne({
              _id: matchId
            });

          case 3:
            match = _context.sent;
            _match$matches$find = match.matches.find(function (_match) {
              return _match._id.toString() !== sender._id.toString();
            }), receiverId = _match$matches$find._id;
            serverDate = (0, _util.getServerDate)();

            if (match) {
              _context.next = 8;
              break;
            }

            throw new Error('This match does not exists');

          case 8:
            newMessage = {
              receiverId: receiverId,
              senderId: sender._id,
              sentAt: serverDate,
              text: message
            };
            _context.next = 11;
            return _Chat["default"].findOneAndUpdate({
              _id: match._id
            }, {
              $addToSet: {
                participants: match.matches,
                messages: newMessage
              }
            }, {
              "new": true,
              upsert: true
            });

          case 11:
            _context.next = 13;
            return _Chat["default"].findOneAndUpdate({
              $and: [{
                _id: matchId
              }, {
                'participants._id': {
                  $eq: sender === null || sender === void 0 ? void 0 : sender._id
                }
              }]
            }, {
              $set: {
                'messages.$[el].viewed': true
              }
            }, {
              arrayFilters: [{
                'el.senderId': receiverId === null || receiverId === void 0 ? void 0 : receiverId._id
              }],
              "new": true
            });

          case 13:
            chat = _context.sent;
            unreadMessagesCount = chat === null || chat === void 0 ? void 0 : (_chat$messages = chat.messages) === null || _chat$messages === void 0 ? void 0 : _chat$messages.filter(function (_message) {
              return (_message === null || _message === void 0 ? void 0 : _message.viewed) === false;
            });
            _context.next = 17;
            return match.update({
              lastMessage: newMessage,
              unreadMessages: unreadMessagesCount === null || unreadMessagesCount === void 0 ? void 0 : unreadMessagesCount.length
            });

          case 17:
            return _context.abrupt("return", chat);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendMessage(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.sendMessage = sendMessage;

var getChat = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var chatId, user, _chat$participants, _chat$messages2, _chat$messages3, _participant$_id, chat, participant, _chat, lastMessageSenderId, participantProfile, __chat;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            chatId = _ref3.chatId, user = _ref3.user;
            _context2.prev = 1;
            _context2.next = 4;
            return _Chat["default"].findOne({
              $and: [{
                _id: chatId
              }, {
                'participants._id': user._id
              }]
            });

          case 4:
            chat = _context2.sent;
            participant = chat === null || chat === void 0 ? void 0 : (_chat$participants = chat.participants) === null || _chat$participants === void 0 ? void 0 : _chat$participants.find(function (_participant) {
              return _participant._id.toString() !== user._id.toString();
            });
            _context2.next = 8;
            return _Chat["default"].findOneAndUpdate({
              $and: [{
                _id: chatId
              }, {
                'participants._id': {
                  $eq: user === null || user === void 0 ? void 0 : user._id
                }
              }]
            }, {
              $set: {
                'messages.$[el].viewed': true
              }
            }, {
              arrayFilters: [{
                'el.senderId': participant === null || participant === void 0 ? void 0 : participant._id
              }],
              "new": true
            });

          case 8:
            _chat = _context2.sent;
            lastMessageSenderId = _chat === null || _chat === void 0 ? void 0 : (_chat$messages2 = _chat.messages) === null || _chat$messages2 === void 0 ? void 0 : _chat$messages2[(_chat === null || _chat === void 0 ? void 0 : (_chat$messages3 = _chat.messages) === null || _chat$messages3 === void 0 ? void 0 : _chat$messages3.length) - 1].senderId;

            if (!(lastMessageSenderId.toString() === (participant === null || participant === void 0 ? void 0 : (_participant$_id = participant._id) === null || _participant$_id === void 0 ? void 0 : _participant$_id.toString()))) {
              _context2.next = 13;
              break;
            }

            _context2.next = 13;
            return _Match["default"].findOneAndUpdate({
              $and: [{
                _id: chatId
              }, {
                'matches._id': user._id
              }]
            }, {
              $set: {
                unreadMessages: 0
              }
            }, {
              "new": true
            });

          case 13:
            _context2.next = 15;
            return _Profile["default"].findById(participant);

          case 15:
            participantProfile = _context2.sent;
            __chat = _objectSpread(_objectSpread({}, _chat === null || _chat === void 0 ? void 0 : _chat.toObject()), {}, {
              participant: participantProfile
            });
            return _context2.abrupt("return", __chat);

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](1);
            throw new Error(_context2.t0);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 20]]);
  }));

  return function getChat(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getChat = getChat;