"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extUnionize = extUnionize;
function extUnionize(record) {
    var creators = {};
    var _loop_1 = function (tag) {
        // @ts-ignore
        creators[tag] = (function (value) {
            var _a;
            if (value === void 0) { value = {}; }
            return _a = {}, _a[tag] = value, _a;
        });
    };
    for (var tag in record) {
        _loop_1(tag);
    }
    var is = {};
    var _loop_2 = function (tag) {
        is[tag] = (function (variant) { return tag in variant; });
    };
    for (var tag in record) {
        _loop_2(tag);
    }
    function evalMatch(variant, cases, defaultCase) {
        if (defaultCase === void 0) { defaultCase = cases.default; }
        var key = Object.keys(variant)[0];
        var handler = cases[key];
        var value = variant[key];
        return handler ? handler(value) : defaultCase(value);
    }
    var match = function (first, second) {
        return second ? evalMatch(first, second) : function (variant) { return evalMatch(variant, first); };
    };
    var identity = function (x) { return x; };
    var transform = function (first, second) {
        return second
            ? evalMatch(first, second, identity)
            : function (variant) { return evalMatch(variant, first, identity); };
    };
    var as = {};
    var _loop_3 = function (expectedTag) {
        var _a;
        as[expectedTag] = match((_a = {},
            _a[expectedTag] = function (x) { return x; },
            _a.default = function (val) {
                throw new Error("Attempted to cast ".concat(val[expectedTag], " as ").concat(expectedTag));
            },
            _a));
    };
    for (var expectedTag in record) {
        _loop_3(expectedTag);
    }
    return Object.assign({
        is: is,
        as: as,
        match: match,
        transform: transform,
        _Record: record,
    }, creators);
}
exports.default = extUnionize;
//# sourceMappingURL=index.js.map