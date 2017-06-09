'use strict';

var _fs = require('fs');

var _classes = require('./classes');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function load(_ref) {
  var path = _ref.path;

  return new Promise(function (resolve, reject) {
    (0, _fs.readFile)(path, function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fileContent: data.toString() });
    });
  });
}

_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
  var f1, _ref3, fileContent, gg;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          f1 = new _classes.Foo();

          console.log(f1);

          _context.prev = 2;
          _context.next = 5;
          return load({ path: '123.txt' });

        case 5:
          _ref3 = _context.sent;
          fileContent = _ref3.fileContent;
          _context.next = 9;
          return load({ path: '123.txt' });

        case 9:
          gg = _context.sent;


          console.log(fileContent);
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context['catch'](2);

          console.error(_context.t0);

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined, [[2, 13]]);
}))();