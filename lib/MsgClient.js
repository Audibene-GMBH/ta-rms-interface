"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pubnub = _interopRequireDefault(require("pubnub"));

var _config = _interopRequireWildcard(require("./config"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var log = _config["default"].log || _config.noop; // can be overloaded by props below

var MsgClient = function MsgClient(props) {
  var _this = this;

  _classCallCheck(this, MsgClient);

  _defineProperty(this, "addHandler", function (callback) {
    if (!callback) return false;

    _this.pubnub.addListener({
      message: function message(payload) {
        if (payload.publisher === _config["default"].pubnub.uuid) return; // I sent it, ignore it

        log({
          pubnub: 'received',
          message: payload.message,
          payload: payload
        });
        callback(payload);
      },
      signal: function signal(payload) {
        if (payload.publisher === _config["default"].pubnub.uuid) return; // I sent it, ignore it

        log({
          pubnub: 'received',
          signal: payload.message,
          payload: payload
        });
        callback(payload);
      }
    });

    return true;
  });

  _defineProperty(this, "handlers", {});

  _defineProperty(this, "processHandlers", function (payload) {
    var message = payload.message;
    _this.handlers[message] && _this.handlers[message](payload);
  });

  _defineProperty(this, "handle", function (message, handler) {
    _this.handlers[message] = handler;
  });

  _defineProperty(this, "stopHandling", function (message) {
    delete _this.handlers[message];
  });

  _defineProperty(this, "send", function (func, msg) {
    if (typeof _this.pubnub[func] != 'function') return false;
    var payload = {
      channel: _this.channel,
      message: msg
    };

    _this.pubnub[func](payload, function (status, response) {
      log({
        pubnub: func,
        message: payload.message,
        payload: payload,
        status: status,
        response: response
      });
    });

    return true;
  });

  _defineProperty(this, "publish", function (msg) {
    return _this.send('publish', msg);
  });

  _defineProperty(this, "signal", function (msg) {
    return _this.send('signal', msg);
  });

  props = props || {};
  log = props.log || log;
  this.pubnub = props.pubnub || new _pubnub["default"](_config["default"].pubnub); //https://www.pubnub.com/docs/platform/first-steps/setup

  this.addHandler(props.callback);
  this.addHandler(this.processHandlers);
  this.channel = props.channel || _config["default"].channel || 'default';
  this.pubnub.subscribe({
    channels: [this.channel] // just one channel - the fitting.id

  });
};

exports["default"] = MsgClient;