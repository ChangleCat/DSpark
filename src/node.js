"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Biconditional = exports.Implication = exports.Disjunction = exports.Conjunction = exports.Negation = exports.Atomic = exports.Grouping = exports.Proposition = exports.Term = exports.TermType = void 0;
var TermType;
(function (TermType) {
    TermType[TermType["CONST"] = 0] = "CONST";
    TermType[TermType["VAR"] = 1] = "VAR";
})(TermType || (exports.TermType = TermType = {}));
var Term = /** @class */ (function () {
    function Term(type, name) {
        this.type = type;
        this.name = name;
    }
    Term.prototype.toString = function () {
        return this.name;
    };
    Term.prototype.equals = function (other) {
        return other instanceof Term && other.name === this.name;
    };
    return Term;
}());
exports.Term = Term;
// 基础命题类型
var Proposition = /** @class */ (function () {
    function Proposition() {
    }
    return Proposition;
}());
exports.Proposition = Proposition;
var Grouping = /** @class */ (function (_super) {
    __extends(Grouping, _super);
    function Grouping(propos) {
        var _this = _super.call(this) || this;
        _this.propos = propos;
        return _this;
    }
    Grouping.prototype.toString = function () {
        return "(".concat(this.propos.toString(), ")");
    };
    Grouping.prototype.equals = function (other) {
        return this.propos.equals(other);
    };
    return Grouping;
}(Proposition));
exports.Grouping = Grouping;
// 原子命题 (量词 P(x, y) )
var Atomic = /** @class */ (function (_super) {
    __extends(Atomic, _super);
    function Atomic(symbol, terms) {
        if (terms === void 0) { terms = []; }
        var _this = _super.call(this) || this;
        _this.symbol = symbol;
        _this.terms = terms;
        return _this;
    }
    Atomic.prototype.toString = function () {
        return this.terms.length > 0
            ? "".concat(this.symbol, "(").concat(this.terms.join(','), ")")
            : this.symbol;
    };
    Atomic.prototype.equals = function (other) {
        if (!(other instanceof Atomic))
            return false;
        if (this.symbol !== other.symbol)
            return false;
        if (this.terms.length !== other.terms.length)
            return false;
        return this.terms.every(function (term, index) {
            return term.equals(other.terms[index]);
        });
    };
    return Atomic;
}(Proposition));
exports.Atomic = Atomic;
// 否定命题 (¬P)
var Negation = /** @class */ (function (_super) {
    __extends(Negation, _super);
    function Negation(proposition) {
        var _this = _super.call(this) || this;
        _this.proposition = proposition;
        return _this;
    }
    Negation.prototype.toString = function () {
        return "~".concat(this.proposition.toString());
    };
    Negation.prototype.equals = function (other) {
        return other instanceof Negation && this.proposition.equals(other.proposition);
    };
    return Negation;
}(Proposition));
exports.Negation = Negation;
// 合取命题 (P ∧ Q)
var Conjunction = /** @class */ (function (_super) {
    __extends(Conjunction, _super);
    function Conjunction(left, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    Conjunction.prototype.toString = function () {
        return "(".concat(this.left.toString(), " & ").concat(this.right.toString(), ")");
    };
    Conjunction.prototype.equals = function (other) {
        return other instanceof Conjunction &&
            this.left.equals(other.left) &&
            this.right.equals(other.right);
    };
    return Conjunction;
}(Proposition));
exports.Conjunction = Conjunction;
// 析取命题 (P ∨ Q)
var Disjunction = /** @class */ (function (_super) {
    __extends(Disjunction, _super);
    function Disjunction(left, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    Disjunction.prototype.toString = function () {
        return "(".concat(this.left.toString(), " V ").concat(this.right.toString(), ")");
    };
    Disjunction.prototype.equals = function (other) {
        return other instanceof Disjunction &&
            this.left.equals(other.left) &&
            this.right.equals(other.right);
    };
    return Disjunction;
}(Proposition));
exports.Disjunction = Disjunction;
// 蕴含命题 (P → Q)
var Implication = /** @class */ (function (_super) {
    __extends(Implication, _super);
    function Implication(antecedent, consequent) {
        var _this = _super.call(this) || this;
        _this.antecedent = antecedent;
        _this.consequent = consequent;
        return _this;
    }
    Implication.prototype.toString = function () {
        return "(".concat(this.antecedent.toString(), " -> ").concat(this.consequent.toString(), ")");
    };
    Implication.prototype.equals = function (other) {
        return other instanceof Implication &&
            this.antecedent.equals(other.antecedent) &&
            this.consequent.equals(other.consequent);
    };
    return Implication;
}(Proposition));
exports.Implication = Implication;
// 双向蕴含命题 (P ↔ Q)
var Biconditional = /** @class */ (function (_super) {
    __extends(Biconditional, _super);
    function Biconditional(left, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    Biconditional.prototype.toString = function () {
        return "(".concat(this.left.toString(), " <-> ").concat(this.right.toString(), ")");
    };
    Biconditional.prototype.equals = function (other) {
        return other instanceof Biconditional &&
            this.left.equals(other.left) &&
            this.right.equals(other.right);
    };
    return Biconditional;
}(Proposition));
exports.Biconditional = Biconditional;
// 使用示例
var P = new Atomic('P');
var Q = new Atomic('Q');
var R = new Atomic('R');
var notP = new Negation(P);
var P_and_Q = new Conjunction(P, Q);
var P_or_Q = new Disjunction(P, Q);
var P_implies_Q = new Implication(P, Q);
var P_iff_Q = new Biconditional(P, Q);
console.log(notP.toString()); // 输出: ¬P
console.log(P_and_Q.toString()); // 输出: (P ∧ Q)
console.log(P_or_Q.toString()); // 输出: (P ∨ Q)
console.log(P_implies_Q.toString()); // 输出: (P → Q)
console.log(P_iff_Q.toString()); // 输出: (P ↔ Q)
// 更复杂的嵌套表达式
var complexExpr = new Implication(new Conjunction(P, new Negation(Q)), new Disjunction(R, new Biconditional(P, Q)));
console.log(complexExpr.toString()); // 输出: ((P ∧ ¬Q) → (R ↔ (P ↔ Q)))
