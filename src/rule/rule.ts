import type { Formula } from "../test/ast"
import { parseFormula, equalFormula, printFormula } from "../test/ast"

export type Side = 'left' | 'right';

export type BaseRule = 
      {kind: 'and-I', left: Formula, right: Formula} 
    | {kind: 'and-E', formula: Formula, side: Side }
    | {kind: 'or-E', or: Formula, left: Formula, right: Formula} 
    | {kind: 'or-I', left: Formula, right: Formula } 
    | {kind: 'implies-E', left: Formula, right: Formula}  
    | {kind: 'implies-I', left: Formula, right: Formula} 
    | {kind: 'double-not-E', formula: Formula}
    | {kind: 'not-E', left: Formula, right: Formula }
    | {kind: 'not-I', left: Formula, right: Formula }
    | {kind: '⊥-E', F: Formula, formula: Formula }
    | {kind: 'forall-E', left: Formula, right: Formula, result: Formula}
    | {kind: 'forall-I', left: Formula, right: Formula, result: Formula}
    | {kind: 'exists-E', left: Formula, right: Formula, result: Formula}
    | {kind: 'exists-I', left: Formula, right: Formula, result: Formula}

export type Theorem =
      {kind: 'MT', left: Formula, right: Formula }
    | {kind: 'double-not-I', formula: Formula }
    | {kind: 'PBC', left: Formula, right: Formula }
    | {kind: 'LEM', formula: Formula }

function inferMT(left: Formula, right: Formula): Formula {
    if (left.kind === 'implies') {
        if (right.kind === 'not') {
            if (equalFormula(left.right, right.formula)) {
                return {kind: 'not', formula: left.left }
            }
            
        }
    } else if (right.kind === 'implies') {
        if (left.kind === 'not') {
            if (equalFormula(left.formula, right.right)) {
                return { kind: 'not', formula: right.left }
            }
        }
    } 
    throw Error("MT error");
}

function inferDoubleNotI(formula: Formula): Formula {
    return { kind: 'not', formula: { kind: 'not', formula}}
}

function inferPBC(left: Formula, right: Formula): Formula {
    if (left.kind === 'F') {
        return { kind: 'not', formula: right };
    } else if (right.kind === 'F') {
        return { kind: 'not', formula: left };
    } else {
        throw Error("Expected ⊥");
    }
}

function inferLEM(formula: Formula): Formula {
    return { kind: 'or', left: formula, right: { kind: 'not', formula: formula }};
}
function inferAndI(left: Formula, right: Formula): Formula {
    return { kind: 'and', left, right };
}
function inferAndE(formula: Formula, side: Side): Formula {
    if (formula.kind === 'and')
        return side === 'left' ? formula.left : formula.right;
    else {
        throw Error("Expected '&' proposition");
    }
}
function inferOrI(left: Formula, right: Formula): Formula {
    return { kind: 'or', left, right };
}
function inferOrE(or: Formula, left: Formula, right: Formula): Formula {
    if (or.kind === 'or') {
        if (left.kind === 'implies' && right.kind === 'implies') {
            if (equalFormula(or.left, left.left) && equalFormula(or.right, right.left)) {
                if (equalFormula(left.right, right.right)) {
                    return left.right;
                }
            }
        }
    }
    throw Error("error or-e");
}
function inferImpliesE(left: Formula, right: Formula): Formula {
    if (right.kind === 'implies') {
        if (equalFormula(left, right.left)) return right.right;
        else throw Error("premise does not equal");
    } else if (left.kind === 'implies') {
        if (equalFormula(left.left, right)) return left.right;
        else throw Error("premise does not equal");
    } else {
        throw Error("Expected implies proposition");
    }
}

function inferImpliesI(left: Formula, right: Formula): Formula {
    return {kind: 'implies', left, right};
}

function inferNotI(left: Formula, right: Formula): Formula {
    if (right.kind === 'F') {
        return {kind: 'not', formula: left};
    }
    else if (left.kind === 'F') {
        return {kind: 'not', formula: right};
    }
    throw Error("not-i error");
}

function inferNotE(left: Formula, right: Formula): Formula {
    if (left.kind === 'not') {
        if (equalFormula(left.formula, right)) {
            return { kind: 'F' };
        }
    }
    else if (right.kind === 'not') {
        if (equalFormula(left, right.formula)) {
            return { kind: 'F' };
        }
    }
    throw Error("not-e error");
}

function inferFE(F: Formula, right: Formula): Formula {
    if (F.kind === 'F')
        return right;
    throw Error("f-e error");
}
function inferDoubleNotE(formula: Formula): Formula {
    if (formula.kind === 'not') {
        if (formula.formula.kind === 'not') {
            return formula.formula.formula;
        }
    }
    throw Error("Expected double not proposition");
}

export function infer(rule: BaseRule | Theorem): Formula {
    switch (rule.kind) {
        case 'and-I':
            return inferAndI(rule.left, rule.right);
        case 'and-E':
            return inferAndE(rule.formula, rule.side);
        case 'or-I':
            return inferOrI(rule.left, rule.right);
        case 'or-E':
            return inferOrE(rule.or, rule.left, rule.right);
        case 'implies-E':
            return inferImpliesE(rule.left, rule.right);
        case 'implies-I':
            return inferImpliesI(rule.left, rule.right);
        case 'double-not-E':
            return inferDoubleNotE(rule.formula);
        case 'not-E':
            return inferNotE(rule.left, rule.right);
        case 'not-I':
            return inferNotI(rule.left, rule.right);
        case '⊥-E':
            return inferFE(rule.F, rule.formula);
        case 'MT':
            return inferMT(rule.left, rule.right);
        case 'double-not-I':
            return inferDoubleNotI(rule.formula);
        case 'PBC':
            return inferPBC(rule.left, rule.right);
        case 'LEM':
            return inferLEM(rule.formula);
        default:
            throw Error("undefined rule");
    }
}

//const f1 = parseFormula("forall x ( P(x) -> exists y ( Q(x, y) and R(y) ))");

console.log("test implies-e");
const f2 = parseFormula("p");
const f3 = parseFormula("p -> Q");
console.log(printFormula(f2) + ", " + printFormula(f3));
let impliesE : BaseRule = { kind: 'implies-E', left: f2, right: f3}
let f4 = infer(impliesE);
console.log(printFormula(f4));
//console.log(JSON.stringify(formula, null, 2));