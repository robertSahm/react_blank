webpackJsonp([5],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(110);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(111);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./typography.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./typography.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Textfit = undefined;

var _Textfit = __webpack_require__(132);

var _Textfit2 = _interopRequireDefault(_Textfit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Textfit = _Textfit2.default;
exports.default = _Textfit2.default;

/***/ }),
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/20d640cf2cb6e736d87a99ce65ccdcd3.svg";

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chainFunction = __webpack_require__(122);

var _chainFunction2 = _interopRequireDefault(_chainFunction);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = __webpack_require__(3);

var _warning2 = _interopRequireDefault(_warning);

var _ChildMapping = __webpack_require__(123);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  component: _propTypes2.default.any,
  childFactory: _propTypes2.default.func,
  children: _propTypes2.default.node
};

var defaultProps = {
  component: 'span',
  childFactory: function childFactory(child) {
    return child;
  }
};

var TransitionGroup = function (_React$Component) {
  _inherits(TransitionGroup, _React$Component);

  function TransitionGroup(props, context) {
    _classCallCheck(this, TransitionGroup);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.performAppear = function (key, component) {
      _this.currentlyTransitioningKeys[key] = true;

      if (component.componentWillAppear) {
        component.componentWillAppear(_this._handleDoneAppearing.bind(_this, key, component));
      } else {
        _this._handleDoneAppearing(key, component);
      }
    };

    _this._handleDoneAppearing = function (key, component) {
      if (component.componentDidAppear) {
        component.componentDidAppear();
      }

      delete _this.currentlyTransitioningKeys[key];

      var currentChildMapping = (0, _ChildMapping.getChildMapping)(_this.props.children);

      if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
        // This was removed before it had fully appeared. Remove it.
        _this.performLeave(key, component);
      }
    };

    _this.performEnter = function (key, component) {
      _this.currentlyTransitioningKeys[key] = true;

      if (component.componentWillEnter) {
        component.componentWillEnter(_this._handleDoneEntering.bind(_this, key, component));
      } else {
        _this._handleDoneEntering(key, component);
      }
    };

    _this._handleDoneEntering = function (key, component) {
      if (component.componentDidEnter) {
        component.componentDidEnter();
      }

      delete _this.currentlyTransitioningKeys[key];

      var currentChildMapping = (0, _ChildMapping.getChildMapping)(_this.props.children);

      if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
        // This was removed before it had fully entered. Remove it.
        _this.performLeave(key, component);
      }
    };

    _this.performLeave = function (key, component) {
      _this.currentlyTransitioningKeys[key] = true;

      if (component.componentWillLeave) {
        component.componentWillLeave(_this._handleDoneLeaving.bind(_this, key, component));
      } else {
        // Note that this is somewhat dangerous b/c it calls setState()
        // again, effectively mutating the component before all the work
        // is done.
        _this._handleDoneLeaving(key, component);
      }
    };

    _this._handleDoneLeaving = function (key, component) {
      if (component.componentDidLeave) {
        component.componentDidLeave();
      }

      delete _this.currentlyTransitioningKeys[key];

      var currentChildMapping = (0, _ChildMapping.getChildMapping)(_this.props.children);

      if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
        // This entered again before it fully left. Add it again.
        _this.keysToEnter.push(key);
      } else {
        _this.setState(function (state) {
          var newChildren = _extends({}, state.children);
          delete newChildren[key];
          return { children: newChildren };
        });
      }
    };

    _this.childRefs = Object.create(null);

    _this.state = {
      children: (0, _ChildMapping.getChildMapping)(props.children)
    };
    return _this;
  }

  TransitionGroup.prototype.componentWillMount = function componentWillMount() {
    this.currentlyTransitioningKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
  };

  TransitionGroup.prototype.componentDidMount = function componentDidMount() {
    var initialChildMapping = this.state.children;
    for (var key in initialChildMapping) {
      if (initialChildMapping[key]) {
        this.performAppear(key, this.childRefs[key]);
      }
    }
  };

  TransitionGroup.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var nextChildMapping = (0, _ChildMapping.getChildMapping)(nextProps.children);
    var prevChildMapping = this.state.children;

    this.setState({
      children: (0, _ChildMapping.mergeChildMappings)(prevChildMapping, nextChildMapping)
    });

    for (var key in nextChildMapping) {
      var hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
      if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
        this.keysToEnter.push(key);
      }
    }

    for (var _key in prevChildMapping) {
      var hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(_key);
      if (prevChildMapping[_key] && !hasNext && !this.currentlyTransitioningKeys[_key]) {
        this.keysToLeave.push(_key);
      }
    }

    // If we want to someday check for reordering, we could do it here.
  };

  TransitionGroup.prototype.componentDidUpdate = function componentDidUpdate() {
    var _this2 = this;

    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(function (key) {
      return _this2.performEnter(key, _this2.childRefs[key]);
    });

    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(function (key) {
      return _this2.performLeave(key, _this2.childRefs[key]);
    });
  };

  TransitionGroup.prototype.render = function render() {
    var _this3 = this;

    // TODO: we could get rid of the need for the wrapper node
    // by cloning a single child
    var childrenToRender = [];

    var _loop = function _loop(key) {
      var child = _this3.state.children[key];
      if (child) {
        var isCallbackRef = typeof child.ref !== 'string';
        var factoryChild = _this3.props.childFactory(child);
        var ref = function ref(r) {
          _this3.childRefs[key] = r;
        };

        process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(isCallbackRef, 'string refs are not supported on children of TransitionGroup and will be ignored. ' + 'Please use a callback ref instead: https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute') : void 0;

        // Always chaining the refs leads to problems when the childFactory
        // wraps the child. The child ref callback gets called twice with the
        // wrapper and the child. So we only need to chain the ref if the
        // factoryChild is not different from child.
        if (factoryChild === child && isCallbackRef) {
          ref = (0, _chainFunction2.default)(child.ref, ref);
        }

        // You may need to apply reactive updates to a child as it is leaving.
        // The normal React way to do it won't work since the child will have
        // already been removed. In case you need this behavior you can provide
        // a childFactory function to wrap every child, even the ones that are
        // leaving.
        childrenToRender.push(_react2.default.cloneElement(factoryChild, {
          key: key,
          ref: ref
        }));
      }
    };

    for (var key in this.state.children) {
      _loop(key);
    }

    // Do not forward TransitionGroup props to primitive DOM nodes
    var props = _extends({}, this.props);
    delete props.transitionLeave;
    delete props.transitionName;
    delete props.transitionAppear;
    delete props.transitionEnter;
    delete props.childFactory;
    delete props.transitionLeaveTimeout;
    delete props.transitionEnterTimeout;
    delete props.transitionAppearTimeout;
    delete props.component;

    return _react2.default.createElement(this.props.component, props, childrenToRender);
  };

  return TransitionGroup;
}(_react2.default.Component);

TransitionGroup.displayName = 'TransitionGroup';


TransitionGroup.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};
TransitionGroup.defaultProps = defaultProps;

exports.default = TransitionGroup;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
module.exports = exports['default'];

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.nameShape = undefined;
exports.transitionTimeout = transitionTimeout;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transitionTimeout(transitionType) {
  var timeoutPropName = 'transition' + transitionType + 'Timeout';
  var enabledPropName = 'transition' + transitionType;

  return function (props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (props[timeoutPropName] == null) {
        return new Error(timeoutPropName + ' wasn\'t supplied to CSSTransitionGroup: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] !== 'number') {
        return new Error(timeoutPropName + ' must be a number (in milliseconds)');
      }
    }

    return null;
  };
}

var nameShape = exports.nameShape = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
  enter: _propTypes2.default.string,
  leave: _propTypes2.default.string,
  active: _propTypes2.default.string
}), _propTypes2.default.shape({
  enter: _propTypes2.default.string,
  enterActive: _propTypes2.default.string,
  leave: _propTypes2.default.string,
  leaveActive: _propTypes2.default.string,
  appear: _propTypes2.default.string,
  appearActive: _propTypes2.default.string
})]);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(141);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
    CAROUSEL: function CAROUSEL(isSlider) {
        return (0, _classnames2.default)({
            "carousel": true,
            "carousel-slider": isSlider
        });
    },

    WRAPPER: function WRAPPER(isSlider, axis) {
        return (0, _classnames2.default)({
            "thumbs-wrapper": !isSlider,
            "slider-wrapper": isSlider,
            "axis-horizontal": axis === "horizontal",
            "axis-vertical": axis !== "horizontal"
        });
    },

    SLIDER: function SLIDER(isSlider, isSwiping) {
        return (0, _classnames2.default)({
            "thumbs": !isSlider,
            "slider": isSlider,
            "animated": !isSwiping
        });
    },

    ITEM: function ITEM(isSlider, selected) {
        return (0, _classnames2.default)({
            "thumb": !isSlider,
            "slide": isSlider,
            "selected": selected
        });
    },

    ARROW_PREV: function ARROW_PREV(disabled) {
        return (0, _classnames2.default)({
            "control-arrow control-prev": true,
            "control-disabled": disabled
        });
    },

    ARROW_NEXT: function ARROW_NEXT(disabled) {
        return (0, _classnames2.default)({
            "control-arrow control-next": true,
            "control-disabled": disabled
        });
    },

    DOT: function DOT(selected) {
        return (0, _classnames2.default)({
            "dot": true,
            'selected': selected
        });
    }
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (position, axis) {
    var positionCss = axis === 'horizontal' ? [position, 0, 0] : [0, position, 0];
    var transitionProp = 'translate3d';

    var translatedPosition = '(' + positionCss.join(',') + ')';

    return transitionProp + translatedPosition;
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(142)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./react-swipe'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.reactSwipe);
    global.index = mod.exports;
  }
})(this, function (exports, _reactSwipe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _reactSwipe2 = _interopRequireDefault(_reactSwipe);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _reactSwipe2.default;
});

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(9);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _cssClasses = __webpack_require__(52);

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _dimensions = __webpack_require__(143);

var _CSSTranslate = __webpack_require__(53);

var _CSSTranslate2 = _interopRequireDefault(_CSSTranslate);

var _reactEasySwipe = __webpack_require__(54);

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Thumbs = function (_Component) {
    _inherits(Thumbs, _Component);

    function Thumbs(props) {
        _classCallCheck(this, Thumbs);

        var _this = _possibleConstructorReturn(this, (Thumbs.__proto__ || Object.getPrototypeOf(Thumbs)).call(this, props));

        _this.updateSizes = function () {
            if (!_this.state.initialized) {
                return;
            }

            var total = _this.props.children.length;
            _this.wrapperSize = _this.itemsWrapper.clientWidth;
            _this.itemSize = _this.props.thumbWidth ? _this.props.thumbWidth : (0, _dimensions.outerWidth)(_this.refs.thumb0);
            _this.visibleItems = Math.floor(_this.wrapperSize / _this.itemSize);
            _this.lastPosition = total - _this.visibleItems;
            _this.showArrows = _this.visibleItems < total;
        };

        _this.setMountState = function () {
            _this.setState({ hasMount: true });
            _this.updateSizes();
        };

        _this.handleClickItem = function (index, item) {
            var handler = _this.props.onSelectItem;

            if (typeof handler === 'function') {
                handler(index, item);
            }
        };

        _this.onSwipeStart = function () {
            _this.setState({
                swiping: true
            });
        };

        _this.onSwipeEnd = function () {
            _this.setState({
                swiping: false
            });
        };

        _this.onSwipeMove = function (deltaX) {
            var leftBoundry = 0;
            var list = _reactDom2.default.findDOMNode(_this.itemList);
            var wrapperSize = list.clientWidth;
            var visibleItems = Math.floor(wrapperSize / _this.itemSize);

            var currentPosition = -_this.state.firstItem * _this.itemSize;
            var lastLeftBoundry = -_this.visibleItems * _this.itemSize;

            // prevent user from swiping left out of boundaries
            if (currentPosition === leftBoundry && deltaX > 0) {
                deltaX = 0;
            }

            // prevent user from swiping right out of boundaries
            if (currentPosition === lastLeftBoundry && deltaX < 0) {
                deltaX = 0;
            }

            var position = currentPosition + 100 / (wrapperSize / deltaX) + '%';

            // if 3d isn't available we will use left to move
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
                list.style[prop] = (0, _CSSTranslate2.default)(position, _this.props.axis);
            });
        };

        _this.slideRight = function (positions) {
            _this.moveTo(_this.state.firstItem - (typeof positions === 'Number' ? positions : 1));
        };

        _this.slideLeft = function (positions) {
            _this.moveTo(_this.state.firstItem + (typeof positions === 'Number' ? positions : 1));
        };

        _this.moveTo = function (position) {
            // position can't be lower than 0
            position = position < 0 ? 0 : position;
            // position can't be higher than last postion
            position = position >= _this.lastPosition ? _this.lastPosition : position;

            _this.setState({
                firstItem: position,
                // if it's not a slider, we don't need to set position here
                selectedItem: _this.state.selectedItem
            });
        };

        _this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            firstItem: _this.getFirstItem(props.selectedItem),
            images: []
        };
        return _this;
    }

    _createClass(Thumbs, [{
        key: 'componentDidMount',
        value: function componentDidMount(nextProps) {
            if (!this.props.children) {
                return;
            }

            this.setupThumbs();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props, state) {
            if (props.selectedItem !== this.state.selectedItem) {
                this.setState({
                    selectedItem: props.selectedItem,
                    firstItem: this.getFirstItem(props.selectedItem)
                });
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (!prevProps.children && this.props.children && !this.state.initialized) {
                this.setupThumbs();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroyThumbs();
        }
    }, {
        key: 'setupThumbs',
        value: function setupThumbs() {
            // as the widths are calculated, we need to resize
            // the carousel when the window is resized
            window.addEventListener("resize", this.updateSizes);
            // issue #2 - image loading smaller
            window.addEventListener("DOMContentLoaded", this.updateSizes);

            var images = this.getImages();

            if (!images) {
                return;
            }

            this.setState({
                initialized: true,
                images: images
            });

            // when the component is rendered we need to calculate
            // the container size to adjust the responsive behaviour
            this.updateSizes();
        }
    }, {
        key: 'destroyThumbs',
        value: function destroyThumbs() {
            // removing listeners
            window.removeEventListener("resize", this.updateSizes);
            window.removeEventListener("DOMContentLoaded", this.updateSizes);
        }
    }, {
        key: 'getImages',
        value: function getImages() {
            var images = _react2.default.Children.map(this.props.children, function (item, index) {
                var img = item;

                // if the item is not an image, try to find the first image in the item's children.
                if (item.type !== "img") {
                    img = _react2.default.Children.toArray(item.props.children).filter(function (children) {
                        return children.type === "img";
                    })[0];
                }

                if (!img || img.length === 0) {
                    return null;
                }

                return img;
            });

            if (images.filter(function (image) {
                return image !== null;
            }).length === 0) {
                console.warn('No images found! Can\'t build the thumb list without images. If you don\'t need thumbs, set showThumbs={false} in the Carousel. Note that it\'s not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md');

                return null;
            }

            return images;
        }
    }, {
        key: 'getFirstItem',
        value: function getFirstItem(selectedItem) {
            if (!this.showArrows) {
                return 0;
            }

            var firstItem = selectedItem;

            if (selectedItem >= this.lastPosition) {
                firstItem = this.lastPosition;
            }

            if (selectedItem < this.state.firstItem + this.visibleItems) {
                firstItem = this.state.firstItem;
            }

            if (selectedItem < this.state.firstItem) {
                firstItem = selectedItem;
            }

            return firstItem;
        }
    }, {
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return this.state.images.map(function (img, index) {
                var itemClass = _cssClasses2.default.ITEM(false, index === _this2.state.selectedItem && _this2.state.hasMount);

                var thumbProps = {
                    key: index,
                    ref: 'thumb' + index,
                    className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index])
                };

                if (index === 0) {
                    img = _react2.default.cloneElement(img, {
                        onLoad: _this2.setMountState
                    });
                }

                return _react2.default.createElement('li', thumbProps, img);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (!this.props.children || this.state.images.length === 0) {
                return null;
            }

            // show left arrow?
            var hasPrev = this.showArrows && this.state.firstItem > 0;
            // show right arrow
            var hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = -this.state.firstItem * this.itemSize + 'px';

            var transformProp = (0, _CSSTranslate2.default)(currentPosition, this.props.axis);

            var transitionTime = this.props.transitionTime + 'ms';

            itemListStyles = {
                'WebkitTransform': transformProp,
                'MozTransform': transformProp,
                'MsTransform': transformProp,
                'OTransform': transformProp,
                'transform': transformProp,
                'msTransform': transformProp,
                'WebkitTransitionDuration': transitionTime,
                'MozTransitionDuration': transitionTime,
                'MsTransitionDuration': transitionTime,
                'OTransitionDuration': transitionTime,
                'transitionDuration': transitionTime,
                'msTransitionDuration': transitionTime
            };

            return _react2.default.createElement('div', { className: _cssClasses2.default.CAROUSEL(false) }, _react2.default.createElement('div', { className: _cssClasses2.default.WRAPPER(false), ref: function ref(node) {
                    return _this3.itemsWrapper = node;
                } }, _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_PREV(!hasPrev), onClick: this.slideRight }), _react2.default.createElement(_reactEasySwipe2.default, { tagName: 'ul',
                selectedItem: this.state.selectedItem,
                className: _cssClasses2.default.SLIDER(false, this.state.swiping),
                onSwipeLeft: this.slideLeft,
                onSwipeRight: this.slideRight,
                onSwipeMove: this.onSwipeMove,
                onSwipeStart: this.onSwipeStart,
                onSwipeEnd: this.onSwipeEnd,
                style: itemListStyles,
                ref: function ref(node) {
                    return _this3.itemList = node;
                } }, this.renderItems()), _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_NEXT(!hasNext), onClick: this.slideLeft })));
        }
    }]);

    return Thumbs;
}(_react.Component);

Thumbs.displayName = 'Thumbs';
Thumbs.propsTypes = {
    children: _propTypes2.default.element.isRequired,
    transitionTime: _propTypes2.default.number,
    selectedItem: _propTypes2.default.number,
    thumbWidth: _propTypes2.default.number
};
Thumbs.defaultProps = {
    selectedItem: 0,
    transitionTime: 350,
    axis: 'horizontal'
};
exports.default = Thumbs;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/46604d94d8de34cc47531c0e49ee2aaf.svg";

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/4586405c85eb84120ac92b9a067d9fd1.svg";

/***/ }),
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/9ecdb0270172272203435556d20d4403.svg";

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(9);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = __webpack_require__(5);

__webpack_require__(108);

__webpack_require__(29);

__webpack_require__(112);

__webpack_require__(114);

var _header = __webpack_require__(116);

var _header2 = _interopRequireDefault(_header);

var _nav = __webpack_require__(118);

var _nav2 = _interopRequireDefault(_nav);

var _routes = __webpack_require__(130);

var _routes2 = _interopRequireDefault(_routes);

var _footer = __webpack_require__(183);

var _footer2 = _interopRequireDefault(_footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get routes


// get header
var App = function App() {
	return _react2.default.createElement(
		_reactRouterDom.BrowserRouter,
		null,
		_react2.default.createElement(
			'div',
			null,
			_react2.default.createElement(_header2.default, null),
			_react2.default.createElement(_reactRouterDom.Route, { route: '/', component: _nav2.default }),
			_react2.default.createElement(_routes2.default, null),
			_react2.default.createElement(_footer2.default, null)
		)
	);
};
// import footer

// get nav


_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById("app"));

/***/ }),
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(109);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./start.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./start.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "*,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box}body,html{padding:0;margin:0}ul{list-style-type:none}.address-row{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:space-evenly;-ms-flex-pack:space-evenly;justify-content:space-evenly;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin-top:40px}@media (min-width:769px){.address-row{margin:40px auto;max-width:1200px}}.address-row .address-box{width:20%}@media  (min-width:545px) and (max-width:768px){.address-row .address-box{width:50%;margin-bottom:40px}}@media  (max-width:544px){.address-row .address-box{width:80%;margin-bottom:40px}}.address-row .map-wrap{width:75%}@media (max-width:768px){.address-row .map-wrap{width:100%}}.row:before{content:'';display:table}.row:after{content:'';display:table;clear:both}.edge-pad{margin:0 3%}.store-shot-row{display:block;width:100%;padding:0 4% 4%}.store-shot-row img{width:100%;margin-top:3px}", ""]);

// exports


/***/ }),
/* 110 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "h1,h2,h3,h4,h5,h6{font-family:Oswald;font-weight:400}.text-center{text-align:center}.text-light{font-weight:200}.text-wide{letter-spacing:.17em;padding:0;margin:10px 0 8px;color:#989898}a{text-decoration:none}a .header-link{margin:5px auto 0}a .header-link:hover{color:#0079cd}.address-box .text-blue,.address-box .text-dark-brown,.address-box .text-dark-green,.address-box .text-gold,.address-box .text-gray,.address-box .text-light-brown,.address-box .text-light-green,.footer-addres-row .address-box .text-blue,.footer-addres-row .address-box .text-dark-brown,.footer-addres-row .address-box .text-dark-green,.footer-addres-row .address-box .text-gold,.footer-addres-row .address-box .text-gray,.footer-addres-row .address-box .text-light-brown,.footer-addres-row .address-box .text-light-green{font-family:Oswald;line-height:0}.text-gold{color:#fdce1e}.text-gray{color:#989898}.text-blue{color:#0079cd}.text-light-brown{color:#b18d00}.text-dark-brown{color:#3e3202}.text-dark-brown.lighten{color:#735c03}.text-light-green{color:#caca00}.text-dark-green{color:#979749}", ""]);

// exports


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./header.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./header.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".header-wrap{width:100%}.header-wrap .logo-wrap{margin:30px auto 0;max-width:377px}@media  (max-width:544px){.header-wrap .logo-wrap{padding:0 15px}}.header-wrap .logo-wrap img{width:100%}", ""]);

// exports


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(115);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./nav.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./nav.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".nav-wrap{font-family:Oswald;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:15px auto 25px;position:relative}@media  (max-width:544px){.nav-wrap{-ms-flex-pack:distribute;justify-content:space-around}}.nav-wrap .link-wrap{width:100px}.nav-wrap a{text-decoration:none;color:#787878;font-size:16px;letter-spacing:.12em;display:block;text-align:center;font-weight:300;cursor:pointer}@media  (max-width:544px){.nav-wrap a{font-size:17px}}.nav-wrap a:hover{color:#0079cd}.nav-wrap .dropdown-wrap{z-index:1;position:absolute;top:30px}.nav-wrap .dropdown-wrap .dropdown{background-color:#fff;padding:12px 20px}.nav-wrap .dropdown-wrap .dropdown a{display:block;padding:3px 0;font-size:.9em;font-weight:300}.transition-span{position:absolute;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.dropmenu-enter{opacity:.01}.dropmenu-enter.dropmenu-enter-active{opacity:1;-webkit-transition:opacity .3s ease;transition:opacity .3s ease}.dropmenu-leave{opacity:1}.dropmenu-leave.dropmenu-leave-active{opacity:.01;-webkit-transition:opacity .3s ease;transition:opacity .3s ease}", ""]);

// exports


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _LogoTrunkAndDrawer = __webpack_require__(117);

var _LogoTrunkAndDrawer2 = _interopRequireDefault(_LogoTrunkAndDrawer);

var _LogoFull = __webpack_require__(48);

var _LogoFull2 = _interopRequireDefault(_LogoFull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header() {
	return _react2.default.createElement(
		"div",
		{ className: 'header-wrap' },
		_react2.default.createElement(
			"div",
			{ className: 'logo-wrap' },
			_react2.default.createElement("img", { src: _LogoFull2.default })
		)
	);
};

exports.default = Header;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/efc3d644e1644eab2484418db8acd49d.svg";

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(5);

var _dropdown = __webpack_require__(119);

var _dropdown2 = _interopRequireDefault(_dropdown);

var _reactTransitionGroup = __webpack_require__(120);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Nav = function (_Component) {
  _inherits(Nav, _Component);

  function Nav(props) {
    _classCallCheck(this, Nav);

    var _this = _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props));

    _this.state = {
      hidden: true
    };
    _this.toggleDropdown = _this.toggleDropdown.bind(_this);
    return _this;
  }

  _createClass(Nav, [{
    key: 'toggleDropdown',
    value: function toggleDropdown() {
      this.setState(function (prevState) {
        return {
          hidden: !prevState.hidden
        };
      });
    }
  }, {
    key: 'closeDropdown',
    value: function closeDropdown() {
      this.setState({
        hidden: true
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'nav-wrap' },
          _react2.default.createElement(
            'div',
            { className: 'link-wrap' },
            _react2.default.createElement(
              _reactRouterDom.Link,
              { className: 'menu-item', to: '/', onClick: function onClick(e) {
                  return _this2.closeDropdown(e);
                } },
              'HOME'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'link-wrap' },
            _react2.default.createElement(
              'a',
              { onClick: function onClick(e) {
                  return _this2.toggleDropdown(e);
                }, className: 'menu-item clickdown' },
              'PRODUCTS'
            )
          ),
          _react2.default.createElement(
            _reactTransitionGroup.CSSTransitionGroup,
            {
              transitionName: 'dropmenu',
              transitionEnterTimeout: 300,
              transitionLeaveTimeout: 300,
              className: 'transition-span'
            },
            this.state.hidden ? null : _react2.default.createElement(
              'div',
              { className: 'dropdown-wrap' },
              _react2.default.createElement(
                'div',
                { className: 'dropdown' },
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { className: 'menu-item dropdown-item', to: '/underwear', onClick: function onClick(e) {
                      return _this2.closeDropdown(e);
                    } },
                  'UNDERWEAR'
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { className: 'menu-item dropdown-item', to: '/lounge', onClick: function onClick(e) {
                      return _this2.closeDropdown(e);
                    } },
                  'SLEEPWEAR\xA0&\xA0LOUNGEWEAR'
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { className: 'menu-item dropdown-item', to: '/socks', onClick: function onClick(e) {
                      return _this2.closeDropdown(e);
                    } },
                  'SOCKS'
                ),
                _react2.default.createElement(
                  _reactRouterDom.Link,
                  { className: 'menu-item dropdown-item', to: '/accessories', onClick: function onClick(e) {
                      return _this2.closeDropdown(e);
                    } },
                  'TRAVEL ACCESSORIES'
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'link-wrap' },
            _react2.default.createElement(
              _reactRouterDom.Link,
              { className: 'menu-item', to: '/contact', onClick: function onClick(e) {
                  return _this2.closeDropdown(e);
                } },
              'CONTACT'
            )
          )
        )
      );
    }
  }]);

  return Nav;
}(_react.Component);

;

exports.default = Nav;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dropdown = function (_Component) {
  _inherits(Dropdown, _Component);

  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, props));

    _this.state = {
      hidden: false,
      props: _this.props,
      pathname: _this.props.pathname
    };
    _this.toggleDropdown = _this.toggleDropdown.bind(_this);
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'componentDidMount',
    value: function componentDidMount(props) {
      this.setState({
        pathname: this.props.pathname
      });
      console.log(this.props.location);
    }
  }, {
    key: 'toggleDropdown',
    value: function toggleDropdown() {
      this.setState(function (prevState) {
        return {
          hidden: !prevState.hidden
        };
      });
    }

    // closeDropdown() {
    //   if(this.state.pathname) {
    //     this.setState({ hidden: true })
    //   }
    // }


  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'dropdown-row' },
        _react2.default.createElement(
          'div',
          { className: 'link-wrap' },
          _react2.default.createElement(
            'a',
            { onClick: function onClick(e) {
                return _this2.toggleDropdown(e);
              }, className: 'menu-item clickdown' },
            'PRODUCTS'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'dropdown-wrap' },
          this.state.hidden ? null : _react2.default.createElement(
            'div',
            { className: 'dropdown' },
            _react2.default.createElement(
              _reactRouterDom.Link,
              { className: 'menu-item dropdown-item', to: '/underwear' },
              'UNDERWEAR'
            ),
            _react2.default.createElement(
              _reactRouterDom.Link,
              { className: 'menu-item dropdown-item', to: '/lounge' },
              'SLEEPWEAR\xA0&\xA0LOUNGEWEAR'
            ),
            _react2.default.createElement(
              _reactRouterDom.Link,
              { className: 'menu-item dropdown-item', to: '/accessories' },
              'TRAVEL ACCESSORIES'
            )
          )
        )
      );
    }
  }]);

  return Dropdown;
}(_react.Component);

exports.default = Dropdown;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _CSSTransitionGroup = __webpack_require__(121);

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _TransitionGroup = __webpack_require__(49);

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  TransitionGroup: _TransitionGroup2.default,
  CSSTransitionGroup: _CSSTransitionGroup2.default
};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TransitionGroup = __webpack_require__(49);

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransitionGroupChild = __webpack_require__(124);

var _CSSTransitionGroupChild2 = _interopRequireDefault(_CSSTransitionGroupChild);

var _PropTypes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  transitionName: _PropTypes.nameShape.isRequired,

  transitionAppear: _propTypes2.default.bool,
  transitionEnter: _propTypes2.default.bool,
  transitionLeave: _propTypes2.default.bool,
  transitionAppearTimeout: (0, _PropTypes.transitionTimeout)('Appear'),
  transitionEnterTimeout: (0, _PropTypes.transitionTimeout)('Enter'),
  transitionLeaveTimeout: (0, _PropTypes.transitionTimeout)('Leave')
};

var defaultProps = {
  transitionAppear: false,
  transitionEnter: true,
  transitionLeave: true
};

var CSSTransitionGroup = function (_React$Component) {
  _inherits(CSSTransitionGroup, _React$Component);

  function CSSTransitionGroup() {
    var _temp, _this, _ret;

    _classCallCheck(this, CSSTransitionGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this._wrapChild = function (child) {
      return _react2.default.createElement(_CSSTransitionGroupChild2.default, {
        name: _this.props.transitionName,
        appear: _this.props.transitionAppear,
        enter: _this.props.transitionEnter,
        leave: _this.props.transitionLeave,
        appearTimeout: _this.props.transitionAppearTimeout,
        enterTimeout: _this.props.transitionEnterTimeout,
        leaveTimeout: _this.props.transitionLeaveTimeout
      }, child);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // We need to provide this childFactory so that
  // ReactCSSTransitionGroupChild can receive updates to name, enter, and
  // leave while it is leaving.


  CSSTransitionGroup.prototype.render = function render() {
    return _react2.default.createElement(_TransitionGroup2.default, _extends({}, this.props, { childFactory: this._wrapChild }));
  };

  return CSSTransitionGroup;
}(_react2.default.Component);

CSSTransitionGroup.displayName = 'CSSTransitionGroup';


CSSTransitionGroup.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};
CSSTransitionGroup.defaultProps = defaultProps;

exports.default = CSSTransitionGroup;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 122 */
/***/ (function(module, exports) {


module.exports = function chain(){
  var len = arguments.length
  var args = [];

  for (var i = 0; i < len; i++)
    args[i] = arguments[i]

  args = args.filter(function(fn){ return fn != null })

  if (args.length === 0) return undefined
  if (args.length === 1) return args[0]

  return args.reduce(function(current, next){
    return function chainedFunction() {
      current.apply(this, arguments);
      next.apply(this, arguments);
    };
  })
}


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getChildMapping = getChildMapping;
exports.mergeChildMappings = mergeChildMappings;

var _react = __webpack_require__(0);

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {*} children `this.props.children`
 * @return {object} Mapping of key to child
 */
function getChildMapping(children) {
  if (!children) {
    return children;
  }
  var result = {};
  _react.Children.map(children, function (child) {
    return child;
  }).forEach(function (child) {
    result[child.key] = child;
  });
  return result;
}

/**
 * When you're adding or removing children some may be added or removed in the
 * same render pass. We want to show *both* since we want to simultaneously
 * animate elements in and out. This function takes a previous set of keys
 * and a new set of keys and merges them with its best guess of the correct
 * ordering. In the future we may expose some of the utilities in
 * ReactMultiChild to make this easy, but for now React itself does not
 * directly have this concept of the union of prevChildren and nextChildren
 * so we implement it here.
 *
 * @param {object} prev prev children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @param {object} next next children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @return {object} a key set that contains all keys in `prev` and all keys
 * in `next` in a reasonable order.
 */
function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};

  function getValueForKey(key) {
    if (next.hasOwnProperty(key)) {
      return next[key];
    }

    return prev[key];
  }

  // For each key of `next`, the list of keys to insert before that key in
  // the combined list
  var nextKeysPending = {};

  var pendingKeys = [];
  for (var prevKey in prev) {
    if (next.hasOwnProperty(prevKey)) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }

  var i = void 0;
  var childMapping = {};
  for (var nextKey in next) {
    if (nextKeysPending.hasOwnProperty(nextKey)) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }
    childMapping[nextKey] = getValueForKey(nextKey);
  }

  // Finally, add the keys which didn't appear before any key in `next`
  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }

  return childMapping;
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _addClass = __webpack_require__(125);

var _addClass2 = _interopRequireDefault(_addClass);

var _removeClass = __webpack_require__(127);

var _removeClass2 = _interopRequireDefault(_removeClass);

var _requestAnimationFrame = __webpack_require__(128);

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _properties = __webpack_require__(129);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = __webpack_require__(9);

var _PropTypes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = [];
if (_properties.transitionEnd) events.push(_properties.transitionEnd);
if (_properties.animationEnd) events.push(_properties.animationEnd);

function addEndListener(node, listener) {
  if (events.length) {
    events.forEach(function (e) {
      return node.addEventListener(e, listener, false);
    });
  } else {
    setTimeout(listener, 0);
  }

  return function () {
    if (!events.length) return;
    events.forEach(function (e) {
      return node.removeEventListener(e, listener, false);
    });
  };
}

var propTypes = {
  children: _propTypes2.default.node,
  name: _PropTypes.nameShape.isRequired,

  // Once we require timeouts to be specified, we can remove the
  // boolean flags (appear etc.) and just accept a number
  // or a bool for the timeout flags (appearTimeout etc.)
  appear: _propTypes2.default.bool,
  enter: _propTypes2.default.bool,
  leave: _propTypes2.default.bool,
  appearTimeout: _propTypes2.default.number,
  enterTimeout: _propTypes2.default.number,
  leaveTimeout: _propTypes2.default.number
};

var CSSTransitionGroupChild = function (_React$Component) {
  _inherits(CSSTransitionGroupChild, _React$Component);

  function CSSTransitionGroupChild() {
    var _temp, _this, _ret;

    _classCallCheck(this, CSSTransitionGroupChild);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.componentWillAppear = function (done) {
      if (_this.props.appear) {
        _this.transition('appear', done, _this.props.appearTimeout);
      } else {
        done();
      }
    }, _this.componentWillEnter = function (done) {
      if (_this.props.enter) {
        _this.transition('enter', done, _this.props.enterTimeout);
      } else {
        done();
      }
    }, _this.componentWillLeave = function (done) {
      if (_this.props.leave) {
        _this.transition('leave', done, _this.props.leaveTimeout);
      } else {
        done();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  CSSTransitionGroupChild.prototype.componentWillMount = function componentWillMount() {
    this.classNameAndNodeQueue = [];
    this.transitionTimeouts = [];
  };

  CSSTransitionGroupChild.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.transitionTimeouts.forEach(function (timeout) {
      clearTimeout(timeout);
    });

    this.classNameAndNodeQueue.length = 0;
  };

  CSSTransitionGroupChild.prototype.transition = function transition(animationType, finishCallback, timeout) {
    var node = (0, _reactDom.findDOMNode)(this);

    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    var className = this.props.name[animationType] || this.props.name + '-' + animationType;
    var activeClassName = this.props.name[animationType + 'Active'] || className + '-active';
    var timer = null;
    var removeListeners = void 0;

    (0, _addClass2.default)(node, className);

    // Need to do this to actually trigger a transition.
    this.queueClassAndNode(activeClassName, node);

    // Clean-up the animation after the specified delay
    var finish = function finish(e) {
      if (e && e.target !== node) {
        return;
      }

      clearTimeout(timer);
      if (removeListeners) removeListeners();

      (0, _removeClass2.default)(node, className);
      (0, _removeClass2.default)(node, activeClassName);

      if (removeListeners) removeListeners();

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    if (timeout) {
      timer = setTimeout(finish, timeout);
      this.transitionTimeouts.push(timer);
    } else if (_properties.transitionEnd) {
      removeListeners = addEndListener(node, finish);
    }
  };

  CSSTransitionGroupChild.prototype.queueClassAndNode = function queueClassAndNode(className, node) {
    var _this2 = this;

    this.classNameAndNodeQueue.push({
      className: className,
      node: node
    });

    if (!this.rafHandle) {
      this.rafHandle = (0, _requestAnimationFrame2.default)(function () {
        return _this2.flushClassNameAndNodeQueue();
      });
    }
  };

  CSSTransitionGroupChild.prototype.flushClassNameAndNodeQueue = function flushClassNameAndNodeQueue() {
    if (!this.unmounted) {
      this.classNameAndNodeQueue.forEach(function (obj) {
        // This is for to force a repaint,
        // which is necessary in order to transition styles when adding a class name.
        /* eslint-disable no-unused-expressions */
        obj.node.scrollTop;
        /* eslint-enable no-unused-expressions */
        (0, _addClass2.default)(obj.node, obj.className);
      });
    }
    this.classNameAndNodeQueue.length = 0;
    this.rafHandle = null;
  };

  CSSTransitionGroupChild.prototype.render = function render() {
    var props = _extends({}, this.props);
    delete props.name;
    delete props.appear;
    delete props.enter;
    delete props.leave;
    delete props.appearTimeout;
    delete props.enterTimeout;
    delete props.leaveTimeout;
    delete props.children;
    return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), props);
  };

  return CSSTransitionGroupChild;
}(_react2.default.Component);

CSSTransitionGroupChild.displayName = 'CSSTransitionGroupChild';


CSSTransitionGroupChild.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};

exports.default = CSSTransitionGroupChild;
module.exports = exports['default'];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addClass;

var _hasClass = __webpack_require__(126);

var _hasClass2 = _interopRequireDefault(_hasClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!(0, _hasClass2.default)(element)) element.className = element.className + ' ' + className;
}
module.exports = exports['default'];

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasClass;
function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return (" " + element.className + " ").indexOf(" " + className + " ") !== -1;
}
module.exports = exports["default"];

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
};

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inDOM = __webpack_require__(50);

var _inDOM2 = _interopRequireDefault(_inDOM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vendors = ['', 'webkit', 'moz', 'o', 'ms'];
var cancel = 'clearTimeout';
var raf = fallback;
var compatRaf = void 0;

var getKey = function getKey(vendor, k) {
  return vendor + (!vendor ? k : k[0].toUpperCase() + k.substr(1)) + 'AnimationFrame';
};

if (_inDOM2.default) {
  vendors.some(function (vendor) {
    var rafKey = getKey(vendor, 'request');

    if (rafKey in window) {
      cancel = getKey(vendor, 'cancel');
      return raf = function raf(cb) {
        return window[rafKey](cb);
      };
    }
  });
}

/* https://github.com/component/raf */
var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime(),
      ms = Math.max(0, 16 - (curr - prev)),
      req = setTimeout(fn, ms);

  prev = curr;
  return req;
}

compatRaf = function compatRaf(cb) {
  return raf(cb);
};
compatRaf.cancel = function (id) {
  window[cancel] && typeof window[cancel] === 'function' && window[cancel](id);
};
exports.default = compatRaf;
module.exports = exports['default'];

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationEnd = exports.animationDelay = exports.animationTiming = exports.animationDuration = exports.animationName = exports.transitionEnd = exports.transitionDuration = exports.transitionDelay = exports.transitionTiming = exports.transitionProperty = exports.transform = undefined;

var _inDOM = __webpack_require__(50);

var _inDOM2 = _interopRequireDefault(_inDOM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transform = 'transform';
var prefix = void 0,
    transitionEnd = void 0,
    animationEnd = void 0;
var transitionProperty = void 0,
    transitionDuration = void 0,
    transitionTiming = void 0,
    transitionDelay = void 0;
var animationName = void 0,
    animationDuration = void 0,
    animationTiming = void 0,
    animationDelay = void 0;

if (_inDOM2.default) {
  var _getTransitionPropert = getTransitionProperties();

  prefix = _getTransitionPropert.prefix;
  exports.transitionEnd = transitionEnd = _getTransitionPropert.transitionEnd;
  exports.animationEnd = animationEnd = _getTransitionPropert.animationEnd;


  exports.transform = transform = prefix + '-' + transform;
  exports.transitionProperty = transitionProperty = prefix + '-transition-property';
  exports.transitionDuration = transitionDuration = prefix + '-transition-duration';
  exports.transitionDelay = transitionDelay = prefix + '-transition-delay';
  exports.transitionTiming = transitionTiming = prefix + '-transition-timing-function';

  exports.animationName = animationName = prefix + '-animation-name';
  exports.animationDuration = animationDuration = prefix + '-animation-duration';
  exports.animationTiming = animationTiming = prefix + '-animation-delay';
  exports.animationDelay = animationDelay = prefix + '-animation-timing-function';
}

exports.transform = transform;
exports.transitionProperty = transitionProperty;
exports.transitionTiming = transitionTiming;
exports.transitionDelay = transitionDelay;
exports.transitionDuration = transitionDuration;
exports.transitionEnd = transitionEnd;
exports.animationName = animationName;
exports.animationDuration = animationDuration;
exports.animationTiming = animationTiming;
exports.animationDelay = animationDelay;
exports.animationEnd = animationEnd;
exports.default = {
  transform: transform,
  end: transitionEnd,
  property: transitionProperty,
  timing: transitionTiming,
  delay: transitionDelay,
  duration: transitionDuration
};


function getTransitionProperties() {
  var style = document.createElement('div').style;

  var vendorMap = {
    O: function O(e) {
      return 'o' + e.toLowerCase();
    },
    Moz: function Moz(e) {
      return e.toLowerCase();
    },
    Webkit: function Webkit(e) {
      return 'webkit' + e;
    },
    ms: function ms(e) {
      return 'MS' + e;
    }
  };

  var vendors = Object.keys(vendorMap);

  var transitionEnd = void 0,
      animationEnd = void 0;
  var prefix = '';

  for (var i = 0; i < vendors.length; i++) {
    var vendor = vendors[i];

    if (vendor + 'TransitionProperty' in style) {
      prefix = '-' + vendor.toLowerCase();
      transitionEnd = vendorMap[vendor]('TransitionEnd');
      animationEnd = vendorMap[vendor]('AnimationEnd');
      break;
    }
  }

  if (!transitionEnd && 'transitionProperty' in style) transitionEnd = 'transitionend';

  if (!animationEnd && 'animationName' in style) animationEnd = 'animationend';

  style = null;

  return { animationEnd: animationEnd, transitionEnd: transitionEnd, prefix: prefix };
}

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(5);

var _home = __webpack_require__(131);

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadingComponent = function (_Component) {
	_inherits(LoadingComponent, _Component);

	function LoadingComponent(props) {
		_classCallCheck(this, LoadingComponent);

		var _this = _possibleConstructorReturn(this, (LoadingComponent.__proto__ || Object.getPrototypeOf(LoadingComponent)).call(this, props));

		_this.state = { loaded: false, module: null };
		return _this;
	}

	_createClass(LoadingComponent, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _this2 = this;

			this.props.routePromise.then(function (module) {
				setTimeout(function () {
					_this2.setState({ loaded: true, module: module.default });
				}, 0);
			});
		}
	}, {
		key: "render",
		value: function render() {
			var isLoaded = this.state.loaded;

			if (this.state.loaded) {
				return _react2.default.createElement(this.state.module, this.props);
			} else {
				return _react2.default.createElement("div", null);
			}
		}
	}]);

	return LoadingComponent;
}(_react.Component);

var Routes = function Routes() {
	return _react2.default.createElement(
		"div",
		null,
		_react2.default.createElement(_reactRouterDom.Route, { exact: true, path: "/", component: _home2.default }),
		_react2.default.createElement(_reactRouterDom.Route, { path: "/underwear",
			component: function component(props) {
				return _react2.default.createElement(LoadingComponent, _extends({}, props, { routePromise: new Promise(function (resolve) {
						__webpack_require__.e/* require.ensure */(0).then((function (require) {
							resolve(__webpack_require__( /*webpackChunkName: "underwear"*/189));
						}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					}) }));
			}
		}),
		_react2.default.createElement(_reactRouterDom.Route, { path: "/lounge",
			component: function component(props) {
				return _react2.default.createElement(LoadingComponent, _extends({}, props, { routePromise: new Promise(function (resolve) {
						__webpack_require__.e/* require.ensure */(3).then((function (require) {
							resolve(__webpack_require__( /*webpackChunkName: "lounge"*/190));
						}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					}) }));
			}
		}),
		_react2.default.createElement(_reactRouterDom.Route, { path: "/socks",
			component: function component(props) {
				return _react2.default.createElement(LoadingComponent, _extends({}, props, { routePromise: new Promise(function (resolve) {
						__webpack_require__.e/* require.ensure */(2).then((function (require) {
							resolve(__webpack_require__( /*webpackChunkName: "socks"*/191));
						}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					}) }));
			}
		}),
		_react2.default.createElement(_reactRouterDom.Route, { path: "/accessories",
			component: function component(props) {
				return _react2.default.createElement(LoadingComponent, _extends({}, props, { routePromise: new Promise(function (resolve) {
						__webpack_require__.e/* require.ensure */(4).then((function (require) {
							resolve(__webpack_require__( /*webpackChunkName: "accessories"*/192));
						}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					}) }));
			}
		}),
		_react2.default.createElement(_reactRouterDom.Route, { path: "/contact",
			component: function component(props) {
				return _react2.default.createElement(LoadingComponent, _extends({}, props, { routePromise: new Promise(function (resolve) {
						__webpack_require__.e/* require.ensure */(1).then((function (require) {
							resolve(__webpack_require__( /*webpackChunkName: "contact"*/193));
						}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					}) }));
			}
		})
	);
};

exports.default = Routes;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(5);

var _reactTextfit = __webpack_require__(30);

var _LogoFull = __webpack_require__(48);

var _LogoFull2 = _interopRequireDefault(_LogoFull);

var _reactResponsiveCarousel = __webpack_require__(139);

var _carousel = __webpack_require__(145);

var _carousel2 = _interopRequireDefault(_carousel);

var _arrowLeft = __webpack_require__(56);

var _arrowLeft2 = _interopRequireDefault(_arrowLeft);

var _arrowRight = __webpack_require__(57);

var _arrowRight2 = _interopRequireDefault(_arrowRight);

var _handLine = __webpack_require__(151);

var _handLine2 = _interopRequireDefault(_handLine);

var _line = __webpack_require__(61);

var _line2 = _interopRequireDefault(_line);

var _underwear = __webpack_require__(152);

var _underwear2 = _interopRequireDefault(_underwear);

var _underwear3 = __webpack_require__(153);

var _underwear4 = _interopRequireDefault(_underwear3);

var _underwear5 = __webpack_require__(154);

var _underwear6 = _interopRequireDefault(_underwear5);

var _underwear7 = __webpack_require__(155);

var _underwear8 = _interopRequireDefault(_underwear7);

var _underwear9 = __webpack_require__(156);

var _underwear10 = _interopRequireDefault(_underwear9);

var _lounge = __webpack_require__(157);

var _lounge2 = _interopRequireDefault(_lounge);

var _lounge3 = __webpack_require__(158);

var _lounge4 = _interopRequireDefault(_lounge3);

var _lounge5 = __webpack_require__(159);

var _lounge6 = _interopRequireDefault(_lounge5);

var _socks = __webpack_require__(160);

var _socks2 = _interopRequireDefault(_socks);

var _socks3 = __webpack_require__(161);

var _socks4 = _interopRequireDefault(_socks3);

var _socks5 = __webpack_require__(162);

var _socks6 = _interopRequireDefault(_socks5);

var _socks7 = __webpack_require__(163);

var _socks8 = _interopRequireDefault(_socks7);

var _socks9 = __webpack_require__(164);

var _socks10 = _interopRequireDefault(_socks9);

var _socks11 = __webpack_require__(165);

var _socks12 = _interopRequireDefault(_socks11);

var _socks13 = __webpack_require__(166);

var _socks14 = _interopRequireDefault(_socks13);

var _socks15 = __webpack_require__(167);

var _socks16 = _interopRequireDefault(_socks15);

var _acc = __webpack_require__(168);

var _acc2 = _interopRequireDefault(_acc);

var _acc3 = __webpack_require__(169);

var _acc4 = _interopRequireDefault(_acc3);

var _acc5 = __webpack_require__(170);

var _acc6 = _interopRequireDefault(_acc5);

var _acc7 = __webpack_require__(171);

var _acc8 = _interopRequireDefault(_acc7);

var _acc9 = __webpack_require__(172);

var _acc10 = _interopRequireDefault(_acc9);

var _acc11 = __webpack_require__(173);

var _acc12 = _interopRequireDefault(_acc11);

var _acc13 = __webpack_require__(174);

var _acc14 = _interopRequireDefault(_acc13);

var _acc15 = __webpack_require__(175);

var _acc16 = _interopRequireDefault(_acc15);

var _acc17 = __webpack_require__(176);

var _acc18 = _interopRequireDefault(_acc17);

var _logoRow = __webpack_require__(177);

var _logoRow2 = _interopRequireDefault(_logoRow);

var _logoRow3 = __webpack_require__(178);

var _logoRow4 = _interopRequireDefault(_logoRow3);

var _logoRow5 = __webpack_require__(179);

var _logoRow6 = _interopRequireDefault(_logoRow5);

var _logoRow7 = __webpack_require__(180);

var _logoRow8 = _interopRequireDefault(_logoRow7);

var _store = __webpack_require__(181);

var _store2 = _interopRequireDefault(_store);

var _store3 = __webpack_require__(182);

var _store4 = _interopRequireDefault(_store3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import GoogleMap from './googlemap'

// import InstafeedComponent from './instafeed'

// Carousel


// Images
// General Page Images


// Underwear


// Loungewear


// Socks


// TravAcccessories


// Lifestyle

// Logos


// Store Shots


var CreateLink = function CreateLink(props) {
  var path = props.path,
      to = props.to,
      text = props.text;

  return _react2.default.createElement(
    _reactRouterDom.Link,
    {
      replace: function () {
        return to === path;
      }(),
      to: to
    },
    _react2.default.createElement(
      'h3',
      { className: 'text-light text-wide text-center header-link' },
      text
    ),
    _react2.default.createElement('img', { className: 'hand-line', src: _handLine2.default })
  );
};

var Home = function (_Component) {
  _inherits(Home, _Component);

  function Home() {
    _classCallCheck(this, Home);

    return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
  }

  _createClass(Home, [{
    key: 'render',
    value: function render() {
      var settings = {
        showThumbs: false,
        showStatus: false,
        dynamicHeight: false
      };

      var pathname = this.props.location.pathname;


      return _react2.default.createElement(
        'div',
        { className: 'content-home' },
        _react2.default.createElement(
          'div',
          { className: 'carousel-wrapper edge-pad' },
          _react2.default.createElement(
            _reactResponsiveCarousel.Carousel,
            settings,
            _react2.default.createElement('img', { src: _underwear2.default }),
            _react2.default.createElement('img', { src: _underwear4.default }),
            _react2.default.createElement('img', { src: _underwear6.default }),
            _react2.default.createElement('img', { src: _underwear8.default }),
            _react2.default.createElement('img', { src: _underwear10.default })
          ),
          _react2.default.createElement(CreateLink, { path: pathname, to: '/underwear', text: 'UNDERWEAR' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'carousel-wrapper edge-pad' },
          _react2.default.createElement(
            _reactResponsiveCarousel.Carousel,
            settings,
            _react2.default.createElement('img', { src: _lounge2.default }),
            _react2.default.createElement('img', { src: _lounge4.default }),
            _react2.default.createElement('img', { src: _lounge6.default })
          ),
          _react2.default.createElement(CreateLink, { path: pathname, to: '/loungewear', text: 'SLEEP AND LOUNGEWEAR' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'row half-wrap' },
          _react2.default.createElement(
            'div',
            { className: 'carousel-wrapper half small-img' },
            _react2.default.createElement(
              _reactResponsiveCarousel.Carousel,
              settings,
              _react2.default.createElement('img', { src: _socks2.default }),
              _react2.default.createElement('img', { src: _socks4.default }),
              _react2.default.createElement('img', { src: _socks6.default }),
              _react2.default.createElement('img', { src: _socks8.default }),
              _react2.default.createElement('img', { src: _socks10.default }),
              _react2.default.createElement('img', { src: _socks12.default }),
              _react2.default.createElement('img', { src: _socks14.default }),
              _react2.default.createElement('img', { src: _socks16.default })
            ),
            _react2.default.createElement(CreateLink, { path: pathname, to: '/socks', text: 'SOCKS' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'carousel-wrapper half small-img' },
            _react2.default.createElement(
              _reactResponsiveCarousel.Carousel,
              settings,
              _react2.default.createElement('img', { src: _acc4.default }),
              _react2.default.createElement('img', { src: _acc2.default }),
              _react2.default.createElement('img', { src: _acc6.default }),
              _react2.default.createElement('img', { src: _acc8.default }),
              _react2.default.createElement('img', { src: _acc10.default }),
              _react2.default.createElement('img', { src: _acc12.default }),
              _react2.default.createElement('img', { src: _acc14.default }),
              _react2.default.createElement('img', { src: _acc16.default }),
              _react2.default.createElement('img', { src: _acc18.default })
            ),
            _react2.default.createElement(CreateLink, { path: pathname, to: '/accessories', text: 'TRAVEL ACCESSORIES' })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'store-shot-row' },
          _react2.default.createElement('img', { src: _store2.default }),
          _react2.default.createElement('img', { src: _store4.default })
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
          _react2.default.createElement('div', { className: 'map-wrap' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'line' },
          _react2.default.createElement('img', { src: _line2.default })
        ),
        _react2.default.createElement(
          'div',
          { className: 'line' },
          _react2.default.createElement('img', { src: _line2.default })
        ),
        _react2.default.createElement(
          'div',
          { className: 'logo-carousel' },
          _react2.default.createElement('img', { src: _logoRow2.default }),
          _react2.default.createElement('img', { src: _logoRow4.default }),
          _react2.default.createElement('img', { src: _logoRow6.default }),
          _react2.default.createElement('img', { src: _logoRow8.default })
        ),
        _react2.default.createElement(
          'div',
          { className: 'line' },
          _react2.default.createElement('img', { src: _line2.default })
        )
      );
    }
  }]);

  return Home;
}(_react.Component);

exports.default = Home;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallowEqual = __webpack_require__(133);

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _series = __webpack_require__(134);

var _series2 = _interopRequireDefault(_series);

var _whilst = __webpack_require__(135);

var _whilst2 = _interopRequireDefault(_whilst);

var _throttle = __webpack_require__(136);

var _throttle2 = _interopRequireDefault(_throttle);

var _uniqueId = __webpack_require__(137);

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _innerSize = __webpack_require__(138);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function assertElementFitsWidth(el, width) {
    // -1: temporary bugfix, will be refactored soon
    return el.scrollWidth - 1 <= width;
}

function assertElementFitsHeight(el, height) {
    // -1: temporary bugfix, will be refactored soon
    return el.scrollHeight - 1 <= height;
}

function noop() {}

var TextFit = function (_React$Component) {
    _inherits(TextFit, _React$Component);

    function TextFit(props) {
        _classCallCheck(this, TextFit);

        var _this = _possibleConstructorReturn(this, (TextFit.__proto__ || Object.getPrototypeOf(TextFit)).call(this, props));

        _this.state = {
            fontSize: null,
            ready: false
        };

        _this.handleWindowResize = function () {
            _this.process();
        };

        if ('perfectFit' in props) {
            console.warn('TextFit property perfectFit has been removed.');
        }
        return _this;
    }

    _createClass(TextFit, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.handleWindowResize = (0, _throttle2.default)(this.handleWindowResize, this.props.throttle);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var autoResize = this.props.autoResize;

            if (autoResize) {
                window.addEventListener('resize', this.handleWindowResize);
            }
            this.process();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var ready = this.state.ready;

            if (!ready) return;
            if ((0, _shallowEqual2.default)(this.props, prevProps)) return;
            this.process();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var autoResize = this.props.autoResize;

            if (autoResize) {
                window.removeEventListener('resize', this.handleWindowResize);
            }
            // Setting a new pid will cancel all running processes
            this.pid = (0, _uniqueId2.default)();
        }
    }, {
        key: 'process',
        value: function process() {
            var _this2 = this;

            var _props = this.props,
                min = _props.min,
                max = _props.max,
                mode = _props.mode,
                forceSingleModeWidth = _props.forceSingleModeWidth,
                onReady = _props.onReady;

            var el = this._parent;
            var wrapper = this._child;

            var originalWidth = (0, _innerSize.innerWidth)(el);
            var originalHeight = (0, _innerSize.innerHeight)(el);

            if (originalHeight <= 0 || isNaN(originalHeight)) {
                console.warn('Can not process element without height. Make sure the element is displayed and has a static height.');
                return;
            }

            if (originalWidth <= 0 || isNaN(originalWidth)) {
                console.warn('Can not process element without width. Make sure the element is displayed and has a static width.');
                return;
            }

            var pid = (0, _uniqueId2.default)();
            this.pid = pid;

            var shouldCancelProcess = function shouldCancelProcess() {
                return pid !== _this2.pid;
            };

            var testPrimary = mode === 'multi' ? function () {
                return assertElementFitsHeight(wrapper, originalHeight);
            } : function () {
                return assertElementFitsWidth(wrapper, originalWidth);
            };

            var testSecondary = mode === 'multi' ? function () {
                return assertElementFitsWidth(wrapper, originalWidth);
            } : function () {
                return assertElementFitsHeight(wrapper, originalHeight);
            };

            var mid = void 0;
            var low = min;
            var high = max;

            this.setState({ ready: false });

            (0, _series2.default)([
            // Step 1:
            // Binary search to fit the element's height (multi line) / width (single line)
            function (stepCallback) {
                return (0, _whilst2.default)(function () {
                    return low <= high;
                }, function (whilstCallback) {
                    if (shouldCancelProcess()) return whilstCallback(true);
                    mid = parseInt((low + high) / 2, 10);
                    _this2.setState({ fontSize: mid }, function () {
                        if (shouldCancelProcess()) return whilstCallback(true);
                        if (testPrimary()) low = mid + 1;else high = mid - 1;
                        return whilstCallback();
                    });
                }, stepCallback);
            },
            // Step 2:
            // Binary search to fit the element's width (multi line) / height (single line)
            // If mode is single and forceSingleModeWidth is true, skip this step
            // in order to not fit the elements height and decrease the width
            function (stepCallback) {
                if (mode === 'single' && forceSingleModeWidth) return stepCallback();
                if (testSecondary()) return stepCallback();
                low = min;
                high = mid;
                return (0, _whilst2.default)(function () {
                    return low < high;
                }, function (whilstCallback) {
                    if (shouldCancelProcess()) return whilstCallback(true);
                    mid = parseInt((low + high) / 2, 10);
                    _this2.setState({ fontSize: mid }, function () {
                        if (pid !== _this2.pid) return whilstCallback(true);
                        if (testSecondary()) low = mid + 1;else high = mid - 1;
                        return whilstCallback();
                    });
                }, stepCallback);
            },
            // Step 3
            // Limits
            function (stepCallback) {
                // We break the previous loop without updating mid for the final time,
                // so we do it here:
                mid = Math.min(low, high);

                // Ensure we hit the user-supplied limits
                mid = Math.max(mid, min);
                mid = Math.min(mid, max);

                // Sanity check:
                mid = Math.max(mid, 0);

                if (shouldCancelProcess()) return stepCallback(true);
                _this2.setState({ fontSize: mid }, stepCallback);
            }], function (err) {
                // err will be true, if another process was triggered
                if (err || shouldCancelProcess()) return;
                _this2.setState({ ready: true }, function () {
                    return onReady(mid);
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props2 = this.props,
                children = _props2.children,
                text = _props2.text,
                style = _props2.style,
                min = _props2.min,
                max = _props2.max,
                mode = _props2.mode,
                forceWidth = _props2.forceWidth,
                forceSingleModeWidth = _props2.forceSingleModeWidth,
                throttle = _props2.throttle,
                autoResize = _props2.autoResize,
                onReady = _props2.onReady,
                props = _objectWithoutProperties(_props2, ['children', 'text', 'style', 'min', 'max', 'mode', 'forceWidth', 'forceSingleModeWidth', 'throttle', 'autoResize', 'onReady']);

            var _state = this.state,
                fontSize = _state.fontSize,
                ready = _state.ready;

            var finalStyle = _extends({}, style, {
                fontSize: fontSize
            });

            var wrapperStyle = {
                display: ready ? 'block' : 'inline-block'
            };
            if (mode === 'single') wrapperStyle.whiteSpace = 'nowrap';

            return _react2.default.createElement(
                'div',
                _extends({ ref: function ref(c) {
                        return _this3._parent = c;
                    }, style: finalStyle }, props),
                _react2.default.createElement(
                    'div',
                    { ref: function ref(c) {
                            return _this3._child = c;
                        }, style: wrapperStyle },
                    text && typeof children === 'function' ? ready ? children(text) : text : children
                )
            );
        }
    }]);

    return TextFit;
}(_react2.default.Component);

TextFit.propTypes = {
    children: _propTypes2.default.node,
    text: _propTypes2.default.string,
    min: _propTypes2.default.number,
    max: _propTypes2.default.number,
    mode: _propTypes2.default.oneOf(['single', 'multi']),
    forceSingleModeWidth: _propTypes2.default.bool,
    throttle: _propTypes2.default.number,
    onReady: _propTypes2.default.func
};
TextFit.defaultProps = {
    min: 1,
    max: 100,
    mode: 'multi',
    forceSingleModeWidth: true,
    throttle: 50,
    autoResize: true,
    onReady: noop
};
exports.default = TextFit;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = shallowEqual;
function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    var hasOwn = Object.prototype.hasOwnProperty;
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
}

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = series;

var _process = __webpack_require__(1);

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function series(tasks, cb) {
    var results = [];
    var current = 0;
    var isSync = true;

    function done(err) {
        function end() {
            if (cb) cb(err, results);
        }
        if (isSync) _process2.default.nextTick(end);else end();
    }

    function each(err, result) {
        results.push(result);
        if (++current >= tasks.length || err) done(err);else tasks[current](each);
    }

    if (tasks.length > 0) tasks[0](each);else done(null);

    isSync = false;
} /**
   * Run the functions in the tasks array in series, each one running once the previous function has completed.
   * If any functions in the series pass an error to its callback, no more functions are run,
   * and callback is immediately called with the value of the error. Otherwise, callback receives an array of results
   * when tasks have completed.
   * Taken from https://github.com/feross/run-series
   *
   * @params {Array} tasks An array containing functions to run, each function is passed a callback(err, result) which it must call on completion with an error err (which can be null) and an optional result value.
   * @params {Function} callback(err, results) - An optional callback to run once all the functions have completed. This function gets a results array containing all the result arguments passed to the task callbacks.
   */

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = whilst;
var noop = function noop() {};

/**
 * Repeatedly call fn, while test returns true. Calls callback when stopped, or an error occurs.
 *
 * @param {Function} test Synchronous truth test to perform before each execution of fn.
 * @param {Function} fn A function which is called each time test passes. The function is passed a callback(err), which must be called once it has completed with an optional err argument.
 * @param {Function} callback A callback which is called after the test fails and repeated execution of fn has stopped.
 */

function whilst(test, iterator) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

    if (test()) {
        iterator(function next(err) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (err) {
                callback(err);
            } else if (test.apply(this, args)) {
                iterator(next);
            } else {
                callback(null);
            }
        });
    } else {
        callback(null);
    }
}

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = throttle;
/**
 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * Taken from https://github.com/component/throttle v1.0.0
 *
 * @param {Function} func Function to wrap.
 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
 * @return {Function} A new function that wraps the `func` function passed in.
 */

function throttle(func, wait) {
    var ctx = void 0;
    var args = void 0;
    var rtn = void 0;
    var timeoutID = void 0;
    var last = 0;

    function call() {
        timeoutID = 0;
        last = +new Date();
        rtn = func.apply(ctx, args);
        ctx = null;
        args = null;
    }

    return function throttled() {
        ctx = this;
        args = arguments;
        var delta = new Date() - last;
        if (!timeoutID) {
            if (delta >= wait) call();else timeoutID = setTimeout(call, wait - delta);
        }
        return rtn;
    };
}

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uniqueId;
var uid = 0;

function uniqueId() {
    return uid++;
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.innerHeight = innerHeight;
exports.innerWidth = innerWidth;
// Calculate height without padding.
function innerHeight(el) {
    var style = window.getComputedStyle(el, null);
    return el.clientHeight - parseInt(style.getPropertyValue('padding-top'), 10) - parseInt(style.getPropertyValue('padding-bottom'), 10);
}

// Calculate width without padding.
function innerWidth(el) {
    var style = window.getComputedStyle(el, null);
    return el.clientWidth - parseInt(style.getPropertyValue('padding-left'), 10) - parseInt(style.getPropertyValue('padding-right'), 10);
}

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Thumbs = exports.Carousel = undefined;

var _Carousel = __webpack_require__(140);

var _Carousel2 = _interopRequireDefault(_Carousel);

var _Thumbs = __webpack_require__(55);

var _Thumbs2 = _interopRequireDefault(_Thumbs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.Carousel = _Carousel2.default;
exports.Thumbs = _Thumbs2.default;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(9);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _cssClasses = __webpack_require__(52);

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _CSSTranslate = __webpack_require__(53);

var _CSSTranslate2 = _interopRequireDefault(_CSSTranslate);

var _reactEasySwipe = __webpack_require__(54);

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

var _Thumbs = __webpack_require__(55);

var _Thumbs2 = _interopRequireDefault(_Thumbs);

var _customPropTypes = __webpack_require__(144);

var customPropTypes = _interopRequireWildcard(_customPropTypes);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var noop = function noop() {};

var defaultStatusFormatter = function defaultStatusFormatter(current, total) {
    return current + ' of ' + total;
};

var Carousel = function (_Component) {
    _inherits(Carousel, _Component);

    function Carousel(props) {
        _classCallCheck(this, Carousel);

        var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

        _this.autoPlay = function () {
            if (!_this.props.autoPlay) {
                return;
            }

            clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                _this.increment();
            }, _this.props.interval);
        };

        _this.clearAutoPlay = function () {
            if (!_this.props.autoPlay) {
                return;
            }

            clearTimeout(_this.timer);
        };

        _this.resetAutoPlay = function () {
            _this.clearAutoPlay();
            _this.autoPlay();
        };

        _this.stopOnHover = function () {
            _this.setState({ isMouseEntered: true });
            _this.clearAutoPlay();
        };

        _this.startOnLeave = function () {
            _this.setState({ isMouseEntered: false });
            _this.autoPlay();
        };

        _this.navigateWithKeyboard = function (e) {
            var axis = _this.props.axis;

            var isHorizontal = axis === 'horizontal';

            var nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
            var prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

            if (nextKey === e.key) {
                _this.increment();
            } else if (prevKey === e.key) {
                _this.decrement();
            }
        };

        _this.updateSizes = function () {
            if (!_this.state.initialized) {
                return;
            }

            var isHorizontal = _this.props.axis === 'horizontal';
            var firstItem = _this.refs.item0;
            var itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

            _this.setState({
                itemSize: itemSize,
                wrapperSize: isHorizontal ? itemSize * _this.props.children.length : itemSize
            });
        };

        _this.setMountState = function () {
            _this.setState({ hasMount: true });
            _this.updateSizes();
        };

        _this.handleClickItem = function (index, item) {
            if (_this.state.cancelClick) {
                _this.setState({
                    cancelClick: false
                });

                return;
            }

            _this.props.onClickItem(index, item);

            if (index !== _this.state.selectedItem) {
                _this.setState({
                    selectedItem: index
                });
            }
        };

        _this.handleOnChange = function (index, item) {
            _this.props.onChange(index, item);
        };

        _this.handleClickThumb = function (index, item) {
            _this.props.onClickThumb(index, item);

            _this.selectItem({
                selectedItem: index
            });
        };

        _this.onSwipeStart = function () {
            _this.setState({
                swiping: true
            });
            _this.clearAutoPlay();
        };

        _this.onSwipeEnd = function () {
            _this.resetPosition();
            _this.setState({
                swiping: false
            });
            _this.autoPlay();
        };

        _this.onSwipeMove = function (delta) {
            var isHorizontal = _this.props.axis === 'horizontal';

            var initialBoundry = 0;

            var currentPosition = -_this.state.selectedItem * 100;
            var finalBoundry = -(_this.props.children.length - 1) * 100;

            var axisDelta = isHorizontal ? delta.x : delta.y;
            var handledDelta = axisDelta;

            // prevent user from swiping left out of boundaries
            if (currentPosition === initialBoundry && axisDelta > 0) {
                handledDelta = 0;
            }

            // prevent user from swiping right out of boundaries
            if (currentPosition === finalBoundry && axisDelta < 0) {
                handledDelta = 0;
            }

            var position = currentPosition + 100 / (_this.state.itemSize / handledDelta) + '%';

            _this.setPosition(position);

            // allows scroll if the swipe was within the tolerance
            var hasMoved = Math.abs(axisDelta) > _this.props.swipeScrollTolerance;

            if (hasMoved && !_this.state.cancelClick) {
                _this.setState({
                    cancelClick: true
                });
            }

            return hasMoved;
        };

        _this.resetPosition = function () {
            var currentPosition = -_this.state.selectedItem * 100 + '%';
            _this.setPosition(currentPosition);
        };

        _this.setPosition = function (position) {
            var list = _reactDom2.default.findDOMNode(_this.refs.itemList);
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
                list.style[prop] = (0, _CSSTranslate2.default)(position, _this.props.axis);
            });
        };

        _this.decrement = function (positions) {
            _this.moveTo(_this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
        };

        _this.increment = function (positions) {
            _this.moveTo(_this.state.selectedItem + (typeof positions === 'Number' ? positions : 1));
        };

        _this.moveTo = function (position) {
            var lastPosition = _this.props.children.length - 1;

            if (position < 0) {
                position = _this.props.infiniteLoop ? lastPosition : 0;
            }

            if (position > lastPosition) {
                position = _this.props.infiniteLoop ? 0 : lastPosition;
            }

            _this.selectItem({
                // if it's not a slider, we don't need to set position here
                selectedItem: position
            });

            // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
            // and will result in the interval function not being cleared correctly.
            if (_this.props.autoPlay && _this.state.isMouseEntered === false) {
                _this.resetAutoPlay();
            }
        };

        _this.changeItem = function (e) {
            var newIndex = e.target.value;

            _this.selectItem({
                selectedItem: newIndex
            });
        };

        _this.selectItem = function (state) {
            _this.setState(state);
            _this.handleOnChange(state.selectedItem, _this.props.children[state.selectedItem]);
        };

        _this.getInitialImage = function () {
            var selectedItem = _this.props.selectedItem;
            var item = _this.refs['item' + selectedItem];
            var images = item && item.getElementsByTagName('img');
            return images && images[selectedItem];
        };

        _this.getVariableImageHeight = function (position) {
            var item = _this.refs['item' + position];
            var images = item && item.getElementsByTagName('img');
            if (_this.state.hasMount && images.length > 0) {
                var image = images[0];

                if (!image.complete) {
                    // if the image is still loading, the size won't be available so we trigger a new render after it's done
                    var onImageLoad = function onImageLoad() {
                        _this.forceUpdate();
                        image.removeEventListener('load', onImageLoad);
                    };

                    image.addEventListener('load', onImageLoad);
                }

                var height = image.clientHeight;
                return height > 0 ? height : null;
            }

            return null;
        };

        _this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            isMouseEntered: false
        };
        return _this;
    }

    _createClass(Carousel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.props.children) {
                return;
            }

            this.setupCarousel();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selectedItem !== this.state.selectedItem) {
                this.updateSizes();
                this.moveTo(nextProps.selectedItem);
            }

            if (nextProps.autoPlay !== this.props.autoPlay) {
                if (nextProps.autoPlay) {
                    this.setupAutoPlay();
                } else {
                    this.destroyAutoPlay();
                }
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (!prevProps.children && this.props.children && !this.state.initialized) {
                this.setupCarousel();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroyCarousel();
        }
    }, {
        key: 'setupCarousel',
        value: function setupCarousel() {
            this.bindEvents();

            if (this.props.autoPlay) {
                this.setupAutoPlay();
            }

            this.setState({
                initialized: true
            });

            var initialImage = this.getInitialImage();
            if (initialImage) {
                // if it's a carousel of images, we set the mount state after the first image is loaded
                initialImage.addEventListener('load', this.setMountState);
            } else {
                this.setMountState();
            }
        }
    }, {
        key: 'destroyCarousel',
        value: function destroyCarousel() {
            if (this.state.initialized) {
                this.unbindEvents();
                this.destroyAutoPlay();
            }
        }
    }, {
        key: 'setupAutoPlay',
        value: function setupAutoPlay() {
            this.autoPlay();
            var carouselWrapper = this.refs['carouselWrapper'];

            if (this.props.stopOnHover && carouselWrapper) {
                carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
                carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
            }
        }
    }, {
        key: 'destroyAutoPlay',
        value: function destroyAutoPlay() {
            this.clearAutoPlay();
            var carouselWrapper = this.refs['carouselWrapper'];

            if (this.props.stopOnHover && carouselWrapper) {
                carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
                carouselWrapper.removeEventListener('mouseleave', this.startOnLeave);
            }
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            // as the widths are calculated, we need to resize
            // the carousel when the window is resized
            window.addEventListener("resize", this.updateSizes);
            // issue #2 - image loading smaller
            window.addEventListener("DOMContentLoaded", this.updateSizes);

            if (this.props.useKeyboardArrows) {
                document.addEventListener("keydown", this.navigateWithKeyboard);
            }
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            // removing listeners
            window.removeEventListener("resize", this.updateSizes);
            window.removeEventListener("DOMContentLoaded", this.updateSizes);

            var initialImage = this.getInitialImage();
            if (initialImage) {
                initialImage.removeEventListener("load", this.setMountState);
            }

            if (this.props.useKeyboardArrows) {
                document.removeEventListener("keydown", this.navigateWithKeyboard);
            }
        }
    }, {
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return _react2.default.Children.map(this.props.children, function (item, index) {
                var hasMount = _this2.state.hasMount;
                var itemClass = _cssClasses2.default.ITEM(true, index === _this2.state.selectedItem);

                return _react2.default.createElement('li', { ref: "item" + index, key: "itemKey" + index, className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, item) }, item);
            });
        }
    }, {
        key: 'renderControls',
        value: function renderControls() {
            var _this3 = this;

            if (!this.props.showIndicators) {
                return null;
            }

            return _react2.default.createElement('ul', { className: 'control-dots' }, _react2.default.Children.map(this.props.children, function (item, index) {
                return _react2.default.createElement('li', { className: _cssClasses2.default.DOT(index === _this3.state.selectedItem), onClick: _this3.changeItem, value: index, key: index });
            }));
        }
    }, {
        key: 'renderStatus',
        value: function renderStatus() {
            if (!this.props.showStatus) {
                return null;
            }

            return _react2.default.createElement('p', { className: 'carousel-status' }, this.props.statusFormatter(this.state.selectedItem + 1, this.props.children.length));
        }
    }, {
        key: 'renderThumbs',
        value: function renderThumbs() {
            if (!this.props.showThumbs || this.props.children.length === 0) {
                return null;
            }

            return _react2.default.createElement(_Thumbs2.default, { onSelectItem: this.handleClickThumb, selectedItem: this.state.selectedItem, transitionTime: this.props.transitionTime, thumbWidth: this.props.thumbWidth }, this.props.children);
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.children || this.props.children.length === 0) {
                return null;
            }

            var itemsLength = this.props.children.length;

            var isHorizontal = this.props.axis === 'horizontal';

            var canShowArrows = this.props.showArrows && itemsLength > 1;

            // show left arrow?
            var hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop);
            // show right arrow
            var hasNext = canShowArrows && (this.state.selectedItem < itemsLength - 1 || this.props.infiniteLoop);
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = -this.state.selectedItem * 100 + '%';
            // if 3d is available, let's take advantage of the performance of transform
            var transformProp = (0, _CSSTranslate2.default)(currentPosition, this.props.axis);

            var transitionTime = this.props.transitionTime + 'ms';

            itemListStyles = {
                'WebkitTransform': transformProp,
                'MozTransform': transformProp,
                'MsTransform': transformProp,
                'OTransform': transformProp,
                'transform': transformProp,
                'msTransform': transformProp
            };

            if (!this.state.swiping) {
                itemListStyles = _extends({}, itemListStyles, {
                    'WebkitTransitionDuration': transitionTime,
                    'MozTransitionDuration': transitionTime,
                    'MsTransitionDuration': transitionTime,
                    'OTransitionDuration': transitionTime,
                    'transitionDuration': transitionTime,
                    'msTransitionDuration': transitionTime
                });
            }

            var swiperProps = {
                selectedItem: this.state.selectedItem,
                className: _cssClasses2.default.SLIDER(true, this.state.swiping),
                onSwipeMove: this.onSwipeMove,
                onSwipeStart: this.onSwipeStart,
                onSwipeEnd: this.onSwipeEnd,
                style: itemListStyles,
                tolerance: this.props.swipeScrollTolerance,
                ref: 'itemList'
            };

            var containerStyles = {};

            if (isHorizontal) {
                swiperProps.onSwipeLeft = this.increment;
                swiperProps.onSwipeRight = this.decrement;

                if (this.props.dynamicHeight) {
                    var itemHeight = this.getVariableImageHeight(this.state.selectedItem);
                    swiperProps.style.height = itemHeight || 'auto';
                    containerStyles.height = itemHeight || 'auto';
                }
            } else {
                swiperProps.onSwipeUp = this.decrement;
                swiperProps.onSwipeDown = this.increment;
                swiperProps.style.height = this.state.itemSize;
                containerStyles.height = this.state.itemSize;
            }

            return _react2.default.createElement('div', { className: this.props.className, ref: 'carouselWrapper' }, _react2.default.createElement('div', { className: _cssClasses2.default.CAROUSEL(true), style: { width: this.props.width } }, _react2.default.createElement('div', { className: _cssClasses2.default.WRAPPER(true, this.props.axis), style: containerStyles, ref: 'itemsWrapper' }, _react2.default.createElement(_reactEasySwipe2.default, _extends({ tagName: 'ul' }, swiperProps, { allowMouseEvents: this.props.emulateTouch }), this.renderItems())), _react2.default.createElement('div', { className: 'controls-wrapper' }, _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_PREV(!hasPrev), onClick: this.decrement
            }), this.renderControls(), _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_NEXT(!hasNext), onClick: this.increment
            }), this.renderStatus())));
            this.renderThumbs();
        }
    }]);

    return Carousel;
}(_react.Component);

Carousel.displayName = 'Carousel';
Carousel.propTypes = {
    className: _propTypes2.default.string,
    children: _propTypes2.default.node,
    showArrows: _propTypes2.default.bool,
    showStatus: _propTypes2.default.bool,
    showIndicators: _propTypes2.default.bool,
    infiniteLoop: _propTypes2.default.bool,
    showThumbs: _propTypes2.default.bool,
    thumbWidth: _propTypes2.default.number,
    selectedItem: _propTypes2.default.number,
    onClickItem: _propTypes2.default.func.isRequired,
    onClickThumb: _propTypes2.default.func.isRequired,
    onChange: _propTypes2.default.func.isRequired,
    axis: _propTypes2.default.oneOf(['horizontal', 'vertical']),
    width: customPropTypes.unit,
    useKeyboardArrows: _propTypes2.default.bool,
    autoPlay: _propTypes2.default.bool,
    stopOnHover: _propTypes2.default.bool,
    interval: _propTypes2.default.number,
    transitionTime: _propTypes2.default.number,
    swipeScrollTolerance: _propTypes2.default.number,
    dynamicHeight: _propTypes2.default.bool,
    emulateTouch: _propTypes2.default.bool,
    statusFormatter: _propTypes2.default.func.isRequired
};
Carousel.defaultProps = {
    showIndicators: true,
    showArrows: true,
    showStatus: true,
    showThumbs: true,
    infiniteLoop: false,
    selectedItem: 0,
    axis: 'horizontal',
    width: '100%',
    useKeyboardArrows: false,
    autoPlay: false,
    stopOnHover: true,
    interval: 3000,
    transitionTime: 350,
    swipeScrollTolerance: 5,
    dynamicHeight: false,
    emulateTouch: false,
    onClickItem: noop,
    onClickThumb: noop,
    onChange: noop,
    statusFormatter: defaultStatusFormatter
};
exports.default = Carousel;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(0), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('prop-types'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.propTypes);
    global.reactSwipe = mod.exports;
  }
})(this, function (exports, _react, _propTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setHasSupportToCaptureOption = setHasSupportToCaptureOption;

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var supportsCaptureOption = false;
  function setHasSupportToCaptureOption(hasSupport) {
    supportsCaptureOption = hasSupport;
  }

  try {
    addEventListener("test", null, Object.defineProperty({}, 'capture', { get: function get() {
        setHasSupportToCaptureOption(true);
      } }));
  } catch (e) {}

  function getSafeEventHandlerOpts() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { capture: true };

    return supportsCaptureOption ? options : options.capture;
  }

  /**
   * [getPosition returns a position element that works for mouse or touch events]
   * @param  {[Event]} event [the received event]
   * @return {[Object]}      [x and y coords]
   */
  function getPosition(event) {
    if ('touches' in event) {
      var _event$touches$ = event.touches[0],
          pageX = _event$touches$.pageX,
          pageY = _event$touches$.pageY;

      return { x: pageX, y: pageY };
    }

    var screenX = event.screenX,
        screenY = event.screenY;

    return { x: screenX, y: screenY };
  }

  var ReactSwipe = function (_Component) {
    _inherits(ReactSwipe, _Component);

    function ReactSwipe() {
      var _ref;

      _classCallCheck(this, ReactSwipe);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_ref = ReactSwipe.__proto__ || Object.getPrototypeOf(ReactSwipe)).call.apply(_ref, [this].concat(args)));

      _this._handleSwipeStart = _this._handleSwipeStart.bind(_this);
      _this._handleSwipeMove = _this._handleSwipeMove.bind(_this);
      _this._handleSwipeEnd = _this._handleSwipeEnd.bind(_this);

      _this._onMouseDown = _this._onMouseDown.bind(_this);
      _this._onMouseMove = _this._onMouseMove.bind(_this);
      _this._onMouseUp = _this._onMouseUp.bind(_this);
      return _this;
    }

    _createClass(ReactSwipe, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.swiper) {
          this.swiper.addEventListener('touchmove', this._handleSwipeMove, getSafeEventHandlerOpts({
            capture: true,
            passive: false
          }));
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.swiper) {
          this.swiper.removeEventListener('touchmove', this._handleSwipeMove, getSafeEventHandlerOpts({
            capture: true,
            passive: false
          }));
        }
      }
    }, {
      key: '_onMouseDown',
      value: function _onMouseDown(event) {
        if (!this.props.allowMouseEvents) {
          return;
        }

        this.mouseDown = true;

        document.addEventListener('mouseup', this._onMouseUp);
        document.addEventListener('mousemove', this._onMouseMove);

        this._handleSwipeStart(event);
      }
    }, {
      key: '_onMouseMove',
      value: function _onMouseMove(event) {
        if (!this.mouseDown) {
          return;
        }

        this._handleSwipeMove(event);
      }
    }, {
      key: '_onMouseUp',
      value: function _onMouseUp(event) {
        this.mouseDown = false;

        document.removeEventListener('mouseup', this._onMouseUp);
        document.removeEventListener('mousemove', this._onMouseMove);

        this._handleSwipeEnd(event);
      }
    }, {
      key: '_handleSwipeStart',
      value: function _handleSwipeStart(event) {
        var _getPosition = getPosition(event),
            x = _getPosition.x,
            y = _getPosition.y;

        this.moveStart = { x: x, y: y };
        this.props.onSwipeStart(event);
      }
    }, {
      key: '_handleSwipeMove',
      value: function _handleSwipeMove(event) {
        var _getPosition2 = getPosition(event),
            x = _getPosition2.x,
            y = _getPosition2.y;

        var deltaX = x - this.moveStart.x;
        var deltaY = y - this.moveStart.y;
        this.moving = true;

        // handling the responsability of cancelling the scroll to
        // the component handling the event
        var shouldPreventDefault = this.props.onSwipeMove({
          x: deltaX,
          y: deltaY
        }, event);

        if (shouldPreventDefault) {
          event.preventDefault();
        }

        this.movePosition = { deltaX: deltaX, deltaY: deltaY };
      }
    }, {
      key: '_handleSwipeEnd',
      value: function _handleSwipeEnd(event) {
        this.props.onSwipeEnd(event);

        var tolerance = this.props.tolerance;


        if (this.moving) {
          if (this.movePosition.deltaX < -tolerance) {
            this.props.onSwipeLeft(1, event);
          } else if (this.movePosition.deltaX > tolerance) {
            this.props.onSwipeRight(1, event);
          }
          if (this.movePosition.deltaY < -tolerance) {
            this.props.onSwipeUp(1, event);
          } else if (this.movePosition.deltaY > tolerance) {
            this.props.onSwipeDown(1, event);
          }
        }

        this.moveStart = null;
        this.moving = false;
        this.movePosition = null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          this.props.tagName,
          {
            ref: function ref(node) {
              return _this2.swiper = node;
            },
            onMouseDown: this._onMouseDown,
            onTouchStart: this._handleSwipeStart,
            onTouchEnd: this._handleSwipeEnd,
            className: this.props.className,
            style: this.props.style
          },
          this.props.children
        );
      }
    }]);

    return ReactSwipe;
  }(_react.Component);

  ReactSwipe.displayName = 'ReactSwipe';
  ReactSwipe.propTypes = {
    tagName: _propTypes2.default.string,
    className: _propTypes2.default.string,
    style: _propTypes2.default.object,
    children: _propTypes2.default.node,
    allowMouseEvents: _propTypes2.default.bool,
    onSwipeUp: _propTypes2.default.func,
    onSwipeDown: _propTypes2.default.func,
    onSwipeLeft: _propTypes2.default.func,
    onSwipeRight: _propTypes2.default.func,
    onSwipeStart: _propTypes2.default.func,
    onSwipeMove: _propTypes2.default.func,
    onSwipeEnd: _propTypes2.default.func,
    tolerance: _propTypes2.default.number.isRequired
  };
  ReactSwipe.defaultProps = {
    tagName: 'div',
    allowMouseEvents: false,
    onSwipeUp: function onSwipeUp() {},
    onSwipeDown: function onSwipeDown() {},
    onSwipeLeft: function onSwipeLeft() {},
    onSwipeRight: function onSwipeRight() {},
    onSwipeStart: function onSwipeStart() {},
    onSwipeMove: function onSwipeMove() {},
    onSwipeEnd: function onSwipeEnd() {},

    tolerance: 0
  };
  exports.default = ReactSwipe;
});

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var outerWidth = exports.outerWidth = function outerWidth(el) {
	var width = el.offsetWidth;
	var style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var unit = exports.unit = function unit(props, propName, componentName) {
    if (!/(pt|px|em|rem|vw|vh|%)$/.test(props[propName])) {
        return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed. It needs to be a size unit like pt, px, em, rem, vw, %');
    }
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(146);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./carousel.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./carousel.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".half-wrap{max-width:1100px;margin:0 auto}.carousel-wrapper{max-width:1200px;margin:0 auto 40px}.carousel-wrapper:before{content:'';display:table}.carousel-wrapper:after{content:'';display:table;clear:both}.carousel-wrapper.third{width:calc(99.9% * 1/3 - (30px - 30px * 1/3))}.carousel-wrapper.third:nth-child(1n){float:left;margin-right:30px;clear:none}.carousel-wrapper.third:last-child{margin-right:0}.carousel-wrapper.third:nth-child(3n){margin-right:0;float:right}.carousel-wrapper.third:nth-child(3n + 1){clear:both}.carousel-wrapper.half{width:calc(99.9% * 1/2 - (30px - 30px * 1/2))}.carousel-wrapper.half:nth-child(1n){float:left;margin-right:30px;clear:none}.carousel-wrapper.half:last-child{margin-right:0}.carousel-wrapper.half:nth-child(2n){margin-right:0;float:right}.carousel-wrapper.half:nth-child(2n + 1){clear:both}@media (max-width:850px){.carousel-wrapper.half{width:calc(99.9% * 1 - (30px - 30px * 1))}.carousel-wrapper.half:nth-child(1n){float:left;margin-right:30px;clear:none}.carousel-wrapper.half:last-child{margin-right:0}.carousel-wrapper.half:nth-child(NaNn){margin-right:0;float:right}.carousel-wrapper.half:nth-child(NaNn + 1){clear:both}}.carousel-wrapper.half.small-img img{height:100%;width:100%;-o-object-fit:contain;object-fit:contain;max-height:400px;max-width:400px}.row-grid{width:80%;margin:0 auto}.row-grid .hand-line{width:100%}.carousel{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.carousel *{margin:0;padding:0}.carousel img{display:inline-block;pointer-events:none}.carousel .slider-wrapper{overflow:hidden;width:100%;-webkit-transition:height .15s ease-in;transition:height .15s ease-in}.carousel .slider-wrapper ul.slider{display:-webkit-box;display:-ms-flexbox;display:flex}.carousel .slider-wrapper ul.slider .slide{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-flow:column;flex-flow:column;min-width:100%;margin:0;position:relative;text-align:center;background:#fff}.carousel .slider-wrapper ul.slider .slide img{width:100%;vertical-align:top;border:0}.carousel .controls-wrapper{width:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-ms-flex-line-pack:center;align-content:center;margin-top:15px}@media  (max-width:544px){.carousel .controls-wrapper{margin:25px auto 0}}.carousel .controls-wrapper .control-arrow{-webkit-transition:opacity .25s ease;transition:opacity .25s ease;border:0;cursor:pointer;outline:none;display:block;width:20px;height:25px;margin:0 15px;opacity:.5}.carousel .controls-wrapper .control-arrow:hover{opacity:1}.carousel .controls-wrapper .control-arrow.control-disabled{opacity:.2}.carousel .controls-wrapper .control-prev{background:url(" + __webpack_require__(56) + ") 100% no-repeat}@media  (max-width:544px){.carousel .controls-wrapper .control-prev{background:url(" + __webpack_require__(147) + ") 100% no-repeat;width:30px;height:34px}}.carousel .controls-wrapper .control-next{background:url(" + __webpack_require__(57) + ") 0 no-repeat}@media  (max-width:544px){.carousel .controls-wrapper .control-next{background:url(" + __webpack_require__(148) + ") 100% no-repeat;width:20px;height:34px}}.carousel .controls-wrapper .control-dots{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.carousel .controls-wrapper .control-dots .dot{-webkit-transition:opacity .25s ease;transition:opacity .25s ease;-webkit-box-sizing:content-box;box-sizing:content-box;opacity:.5;background:url(" + __webpack_require__(149) + ") 0 no-repeat;width:12px;height:12px;margin:0 7px;padding:2px;cursor:pointer}.carousel .controls-wrapper .control-dots .dot:hover{opacity:1}.carousel .controls-wrapper .control-dots .dot.selected{background:url(" + __webpack_require__(150) + ") 0 no-repeat;opacity:1;border:0}.logo-carousel{margin:0 5%;padding:3% 10%}@media  (max-width:544px){.logo-carousel{margin:0 2%;padding:5%}}@media (min-width:993px){.logo-carousel{max-width:1200px;margin:0 auto}}.logo-carousel img{width:100%}.hand-line,.line{margin:8px auto;display:block;width:100%;max-width:450px}.hand-line img,.line img{width:100%}", ""]);

// exports


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/91961a8a8cf3d40d4061ec9f8a268b68.svg";

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/04c78b7ca9804c91391a162716836d14.svg";

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/c750486916c48b9ab976e677436cfcda.svg";

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/9ce2e5b048adaf7d604d8dea769b3579.svg";

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/9025a1fc3b41b7a17571edca1beecff4.svg";

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/234f74bc82c594b84cb39ed09779acba.jpg";

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/b68f777bb03ecfe0bb547297c508d199.jpg";

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/183402748fb13d4dcfd9a6b9b77141fa.jpg";

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/32217c21bdec0c15813735e246a4c3e5.jpg";

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/a204ef0b50081191d6693b2680eeb672.jpg";

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/d86d4ae0d54b1ea92c9099039bb11517.jpg";

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/d03d51c8688b086f4b4d282ab5d496bc.jpg";

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/c82f00eb5cc9ba4c0744c4f67a27c822.jpg";

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/24e454a747fc5d32325961492dab3616.jpg";

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/fe2d3372cdb9e5a6cec540b581e43248.jpg";

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/592a38ad76eb76b5d4da1d5ebde4507e.jpg";

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/59cac8efb9290c0f20c20cdc0f1c01ee.jpg";

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/4d5639cc215c7b881b62b36717ec7954.jpg";

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/c1d53c0b557a0e0cf62de1d7c3c445a1.jpg";

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/5687c56317f744a978aff1fbbda7f00d.jpg";

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/7b98a44e02e4865ceab8766bb1286ef6.jpg";

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/916ce44a87b5a6d2b14f33abe147b76a.jpg";

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/3432c433d3dc1fca37d67731593efbb9.jpg";

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/3878dec4841f99ecdc6dead2d9b64818.jpg";

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/bb46fc074ae0686f24760ecee2802ca2.jpg";

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/3eaaa150de0d1b633d09978d76e8b5ac.jpg";

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/c68f117b1c25828734432abe139d49ca.jpg";

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/855efabecd8da635e669b0ec60065e3b.jpg";

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/b3ba7e8a12fbbdde0628d02e666e4d21.jpg";

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/102810b9001222f98cf5d87af0e617b0.jpg";

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/cbbf0463a5be9a0ded05c41504c5f02d.png";

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/9d39e39c3ba4a61734d45784ecfd4bd8.png";

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/78afa66993fc9c08b72c9c66512eda03.png";

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/96255d80b82461c3246e1b2d7cb83014.png";

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/fa59bb90c5407c40ac6f4f71bd061461.jpg";

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/b579ff747c500ebbb949635bce1a25fd.jpg";

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(5);

var _reactTextfit = __webpack_require__(30);

var _logoFooter = __webpack_require__(184);

var _logoFooter2 = _interopRequireDefault(_logoFooter);

__webpack_require__(185);

__webpack_require__(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import '../styles/home.css'

var Footer = function (_Component) {
  _inherits(Footer, _Component);

  function Footer() {
    _classCallCheck(this, Footer);

    return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
  }

  _createClass(Footer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'footer-wrap' },
        _react2.default.createElement(
          'div',
          { className: 'footer-nav-wrap' },
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'menu-item', to: '/home' },
            'HOME'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'menu-item', to: '/home' },
            'CONTACT'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'menu-item', to: '/underwear' },
            'UNDERWEAR'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'menu-item', to: '/lounge' },
            'SLEEPWEAR\xA0&\xA0LOUNGEWEAR'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'menu-item', to: '/socks' },
            'SOCKS'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'menu-item', to: '/accessories' },
            'TRAVEL ACCESSORIES'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'footer-logo-wrap' },
          _react2.default.createElement('img', { className: '', src: _logoFooter2.default })
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
                'MON-TH 10am - 7:30pm'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-dark-brown lighten' },
                'FRI-SAT 10am - 8:30pm'
              )
            ),
            _react2.default.createElement(
              _reactTextfit.Textfit,
              { mode: 'single' },
              _react2.default.createElement(
                'span',
                { className: 'text-dark-brown' },
                'SUNDAY 11am - 6pm'
              )
            )
          )
        ),
        _react2.default.createElement(
          'h5',
          { className: 'copyright text-gold' },
          'coppyright \xA9 2017 Trunk and Drawer LLC'
        )
      );
    }
  }]);

  return Footer;
}(_react.Component);

exports.default = Footer;

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/9438679fb8c9878fdc7fbb5fa3ae3453.svg";

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./footer.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js!./footer.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".footer-wrap{width:100%;background-color:#777;margin-top:50px;padding-top:50px}.footer-wrap .footer-nav-wrap{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-ms-flex-wrap:wrap;flex-wrap:wrap;margin:0 30px}.footer-wrap .footer-nav-wrap .menu-item{font-family:Oswald;color:#fdce1e;font-size:14px;padding:10px;font-weight:300;letter-spacing:.07em}.footer-wrap .footer-logo-wrap{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-top:30px;padding-bottom:30px}.footer-wrap .address-row{margin-top:0}.footer-wrap h5.copyright{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-bottom:0;padding-bottom:70px;font-weight:300}", ""]);

// exports


/***/ })
],[62]);
//# sourceMappingURL=app.7a4a179cb47321257f4c.js.map