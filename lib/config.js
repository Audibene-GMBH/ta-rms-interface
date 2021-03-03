"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.noop = exports.log = void 0;
var log = console.log; // eslint-disable-next-line no-console
// export const log = console.log
// eslint-disable-next-line @typescript-eslint/no-empty-function

exports.log = log;

var noop = function noop() {};

exports.noop = noop;
var cockpit = {
  env: process.env
};
var pubnub = {
  publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
  uuid: 'replace with fitting.fitter.id'
};
var config = {
  cockpit: cockpit,
  log: log,
  pubnub: pubnub
};
var _default = config;
exports["default"] = _default;