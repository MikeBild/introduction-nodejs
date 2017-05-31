'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var load = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var response, publicGists;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _isomorphicFetch2.default)('https://api.github.com/gists/public');

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.json();

          case 5:
            publicGists = _context.sent;
            return _context.abrupt('return', publicGists.map(function (x) {
              return x.commits_url;
            }));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function load() {
    return _ref3.apply(this, arguments);
  };
}();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _foo$doSome = {
  foo: 'bar',
  doSome: doSome2
},
    doSome = _foo$doSome.doSome;


doSome({});

function doSome2(_ref) {
  var _ref$port = _ref.port,
      port = _ref$port === undefined ? 9090 : _ref$port;

  console.log(port);
}

function extend() {
  var shoe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var newShow = _extends({}, shoe, { id: 4 });
  return newShow;
}

var Base = function Base() {
  _classCallCheck(this, Base);

  console.log('from base');
};

var Foo = function (_Base) {
  _inherits(Foo, _Base);

  function Foo(_ref2) {
    var _ref2$bar = _ref2.bar,
        bar = _ref2$bar === undefined ? 9 : _ref2$bar;

    _classCallCheck(this, Foo);

    var _this = _possibleConstructorReturn(this, (Foo.__proto__ || Object.getPrototypeOf(Foo)).call(this));

    _this.bar = bar;
    return _this;
  }

  _createClass(Foo, [{
    key: 'doSome',
    value: function doSome() {
      console.log(this.bar);
    }
  }]);

  return Foo;
}(Base);

var f1 = new Foo({ bar: 5 });
// f1.bar = 11;
f1.doSome();

;

load().then(console.log).catch(console.error);