/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return rWhitespace; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return rEnclosedQuotes; });

// Some regexes

// Allow spaces if there are quotes, but don't if there aren't.
const   rEntry = /[\w]/,
        rWhitespace = /\s+/,
        rEnclosedQuotes = /^".*"$/;




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_regex__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parser_parser__ = __webpack_require__(2);




window.Parser = __WEBPACK_IMPORTED_MODULE_1__parser_parser__["a" /* default */];


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_reader__ = __webpack_require__(3);



class Parser {
    constructor(jsonString) {
        this.str = jsonString;
    }

    parse() {
        // return a parsed and validated object in JSON.
        return Object(__WEBPACK_IMPORTED_MODULE_0__components_reader__["a" /* default */])(this.str);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Parser;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = read;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_regex__ = __webpack_require__(0);




function read(string) {
    let currentComponent = "",
        currentEntry = "",
        mode = 0, // Modes: 0 building key, 1 building value, 2 in between
        cursor = 0;

    const notation = {};

    // If the string can't be validated, simply return.
    // This performs a shallow validation to skip most of the work.
    if (!Object(__WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */])(string))
        return;

    while (cursor < string.length) {
        console.log("Token: " + string[cursor] + "\nMode: " + mode);

        // Parsing error.
        if (cursor === 0 &&
            (string[cursor] !== "{" || string[string.length - 1] !== "}")) {
            console.error("[JSON String Parser] Parsing error: Inbalanced brackets detected.");
            return;
        }

        if (cursor === 0 && string[cursor] === "{") {
            cursor++;
            continue;
        }

        // Check if the character is a colon and that it is correctly placed.
        // Perform checks to make sure we're not parsing an invalid key.
        else if (mode === 0 && string[cursor] === ":") {
            if (!validateKeyValue(currentComponent) &&
                !validateKeyValue(currentComponent.trim())) {
                console.error("[JSON String Parser] Parsing error: Invalid key value.");
                return;
            }

            mode++;
        }

        // Append the completed entry. Only do it if we encounter a closing
        // parenthesis or comma.
        else if (mode === 1 &&
                (string[cursor] === "," || string[cursor] === "}")) {
            if (currentComponent && currentEntry) {
                if (typeof currentEntry === "string")
                    currentEntry = typify(polish(currentEntry));

                notation[currentComponent.trim()] = currentEntry;

                currentComponent = "";
                currentEntry = "";
            }

            mode++;
        }

        // Mode 2 is the step between two entries: a comma token had been
        // detected, so in this step all whitespaces are skipped.
        else if (mode === 2) {
            if (!__WEBPACK_IMPORTED_MODULE_1__util_regex__["b" /* rWhitespace */].test(string[cursor])) {
                // Reset and parse a new entry.
                cursor--;
                mode = 0;
            }
        }

        else {
            if (mode === 0) {
                currentComponent += string[cursor];
            } else if (mode === 1) {
                if (currentEntry.trim() && currentEntry.trim()[0] !== "\"" && __WEBPACK_IMPORTED_MODULE_1__util_regex__["b" /* rWhitespace */].test(string[cursor])) {
                    console.error("[JSON String Parser] Values must be enclosed in quotation marks to feature whitespaces.");
                    return;
                }

                currentEntry += string[cursor];
            }
        }

        cursor++;
    }

    /**
     * Attempts to assign a "type" to a specified value.
     */
    function typify(value) {
        if (value === "true")
            return true;

        if (value === "false")
            return false;

        if (value === "null")
            return null;

        if (Number.parseFloat(value) == value)
            return Number.parseFloat(value);

        if (Number.parseInt(value) == value)
            return Number.parseInt(value);

        return value;
    }

    /**
     * Checks to see if the key or value is enclosed in quotation marks.
     * @param key - a value to validate.
     * @return returns whether a specified key or value is deemed valid (boolean).
     */
    function validateKeyValue(key) {
        if ((key[0] === "\"" && key[key.length - 1] !== "\"") ||
            (key[0] !== "\"" && key[key.length - 1] === "\""))
            return false;

        return true;
    }

    function polish(string) {
        string = string.trim();

        if (__WEBPACK_IMPORTED_MODULE_1__util_regex__["a" /* rEnclosedQuotes */].test(string))
            return string.substring(1, string.length - 1);

        return string;
    }

    function enclosedQuotes(string) {
        return __WEBPACK_IMPORTED_MODULE_1__util_regex__["a" /* rEnclosedQuotes */].test(string);
    }

    return notation;
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* harmony default export */ __webpack_exports__["a"] = (function (string) {
    // Just find that an opening bracket closes.
    if (typeof string !== "string")
        return false;

    let i,
        tracker = [];

    for (i of string) {
        if (i === "{")
            tracker.push(0);
        else if (i === "}") {
            if (!tracker.length)
                return false;

            if (tracker[tracker.length - 1] === 0) {
                tracker.pop();
                continue;
            }

            return false;
        }
    }

    return !tracker.length;
});


/***/ })
/******/ ]);