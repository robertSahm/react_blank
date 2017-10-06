webpackJsonp([1],{

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactTextfit = __webpack_require__(106);

var _googlemap = __webpack_require__(187);

var _googlemap2 = _interopRequireDefault(_googlemap);

var _lineSmall = __webpack_require__(534);

var _lineSmall2 = _interopRequireDefault(_lineSmall);

__webpack_require__(535);

__webpack_require__(105);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Contact = function (_Component) {
  _inherits(Contact, _Component);

  function Contact() {
    _classCallCheck(this, Contact);

    return _possibleConstructorReturn(this, (Contact.__proto__ || Object.getPrototypeOf(Contact)).apply(this, arguments));
  }

  _createClass(Contact, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'contact-wrap' },
        _react2.default.createElement(
          'div',
          { className: 'line' },
          _react2.default.createElement('img', { src: _lineSmall2.default })
        ),
        _react2.default.createElement(
          'div',
          { className: 'email-wrap' },
          _react2.default.createElement(
            'a',
            { href: 'mailto:info@trunkanddrawer.com' },
            'INFO@TRUNKANDDRAWER.COM'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'line' },
          _react2.default.createElement('img', { src: _lineSmall2.default })
        ),
        _react2.default.createElement(
          'div',
          { className: 'address-row' },
          _react2.default.createElement(
            'div',
            { className: 'address-box' },
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-gold' },
                '3109 M ST NW'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-light-brown' },
                'WASHINGTON, DC 20007'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-light-green' },
                '(202) 333-4213'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-dark-green' },
                'MON-TH | 10 am - 7:30 pm'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-dark-brown lighten' },
                'FRI-SAT | 10 am - 8:30 pm'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-dark-brown' },
                'SUNDAY | 11 am - 6 pm'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'map-wrap' },
            _react2.default.createElement(_googlemap2.default, null)
          )
        )
      );
    }
  }]);

  return Contact;
}(_react.Component);

exports.default = Contact;

/***/ }),

/***/ 534:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/23d700fa71e55bc7b9d620453652bf3e.svg";

/***/ }),

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(536);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(20)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./contact.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./contact.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 536:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(19)(undefined);
// imports


// module
exports.push([module.i, ".contact-wrap .email-wrap{text-align:center;width:100%}.contact-wrap .email-wrap a{font-family:Oswald;font-weight:300;font-size:24px;color:#787878;letter-spacing:.07em}", ""]);

// exports


/***/ })

});
//# sourceMappingURL=1.0bfbf672b23c4b674457.js.map