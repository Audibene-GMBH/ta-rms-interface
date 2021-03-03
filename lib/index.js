"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MsgClient = require("./MsgClient");

Object.keys(_MsgClient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _MsgClient[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _MsgClient[key];
    }
  });
});