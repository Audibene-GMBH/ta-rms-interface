"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockPubNub = exports.mockSend = void 0;

var _MsgClient = _interopRequireDefault(require("./MsgClient"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mockSend = function mockSend(data, callback) {
  callback(200, data);
};

exports.mockSend = mockSend;
var mockPubNub = {
  publish: mockSend,
  subscribe: _config.noop,
  signal: mockSend,
  addListener: _config.noop
};
exports.mockPubNub = mockPubNub;
describe('MsgClient', function () {
  var logs = {};

  var log = function log(data) {
    logs[data.payload.message || 'last'] = data;
  };

  var mock = new _MsgClient["default"]({
    pubnub: mockPubNub,
    log: log
  });
  var msgs = ['one', 'two', 'three'];
  var count = 0;
  test('mockSend', function () {
    var msg = 'testing';
    mockSend(msg, function (status, data) {
      expect(status).toBe(200);
      expect(data).toBe(msg);
    });
  });
  test('addHandler', function () {
    expect(mock.addHandler()).toBeFalsy();
    expect(mock.addHandler('noop', _config.noop)).toBeTruthy();
  });
  test('handle', function () {
    msgs.forEach(function (m) {
      mock.handle(m, function () {
        return count++;
      });
      mock.processHandlers({
        message: m
      });
    });
    expect(count).toBe(msgs.length);
  });
  test('stopHandling', function () {
    msgs.forEach(function (m) {
      mock.handle(m, function () {
        return count++;
      });
      mock.processHandlers({
        message: m
      });
    });
    mock.stopHandling(msgs[0]);
    count = 0;
    msgs.forEach(function (m) {
      mock.processHandlers({
        message: m
      });
    });
    expect(count).toBe(msgs.length - 1);
  });
  test('send', function () {
    var msg = 'testing send';
    expect(mock.send()).toBeFalsy();
    expect(mock.send('signal', msg)).toBeTruthy();
    expect(logs[msg].payload.message).toBe(msg);
    msg = 'testing publish via send';
    expect(mock.send('publish', msg)).toBeTruthy();
    expect(logs[msg].payload.message).toBe(msg);
  });
  test('signal', function () {
    var msg = 'testing signal';
    mock.signal(msg);
    expect(logs[msg].payload.message).toBe(msg);
  });
  test('publish', function () {
    var msg = 'testing publish';
    mock.publish(msg);
    expect(logs[msg].payload.message).toBe(msg);
  });
});