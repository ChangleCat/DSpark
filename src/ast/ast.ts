<<<<<<< HEAD
=======

>>>>>>> a5639dc0e9ff7fd290f57ebef4d32e3eff32ea02
export type Var = string;

export type Term = 
    | { kind: 'var', name: Var }
    | { kind: 'func', name: string, args: Term[] };

export type Predicate = {
    kind: 'predicate',
    name: string,
    args: Term[]
};

export type Formula = 
    | Predicate
    | { kind: 'not', formula: Formula }
    | { kind: 'and', left: Formula, right: Formula }
    | { kind: 'or', left: Formula, right: Formula }
    | { kind: 'implies', left: Formula, right: Formula}
    | { kind: 'grouping', body: Formula }
    | { kind: 'F'}
    | { kind: 'T'}
    | { kind: 'forall', var: Var, body: Formula }
    | { kind: 'exists', var: Var, body: Formula };

export type Token = 
    | { type: 'identifier'; value: string; start: number; end: number}
    | { type: 'symbol'; value: string; start: number; end: number }
    | { type: 'connect'; value: string; start: number; end: number }
    | { type: 'keyword'; value: string; start: number; end: number }

export type TokenType = 'identifier' | 'symbol' | 'keyword' | 'connect';

// forall.x [ P(x) -> exists.y [ Q(x, y) & R(y) ] ]
export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    const regex = 
    /\s*(->|<->|≡|&|\||~|forall|exists|[A-Za-z_][A-Za-z0-9_]*|[()\[\],.])\s*/gy;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(input))) {
        const value = match[1];
        const start = match.index;
        const end = start + match[0].length;
        if (['forall', 'exists'].includes(value)) {
            tokens.push({ type: 'keyword', value, start, end });
        } else if (['&', '|', '~', '->', '<->', '≡'].includes(value)) {
            tokens.push({ type: 'connect', value, start, end });
        } else if ('()[],.'.includes(value)) {
            tokens.push({ type: 'symbol', value, start, end})
        } else {
            tokens.push({ type: 'identifier', value, start, end });
        }
    }
    return tokens;
}

// let tokens = tokenize("forall.x [ P(x) -> exists.y [ Q(x, y) & R(y) ] ]");
// for (const token of tokens) {
//     console.log(token);
// }

class Parser {
    private pos = 0;

    constructor(private tokens: Token[]) {}

    isAtEnd(): boolean {
        return this.pos >= this.tokens.length;
    }

    private peek(): Token {
        return this.tokens[this.pos];
    }

    private previous(): Token {
        return this.tokens[this.pos - 1];
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.pos++;
        return this.previous();
    }

    match(type: TokenType, ...values: string[]) {
        if (!this.isAtEnd()) {
            const token = this.peek();
            if (token.type === type) {
                for (const value of values) {
                    if (token.value === value) {
                        this.advance();
                        return true;
                    }
                }
            }
        } 
        return false;
    }

    private expectSymbol(value: string) {
        const token = this.advance();
        if (token.type !== 'symbol' || token.value !== value) {
            throw new Error(`Expected symbol '${value}' but got '${token.value}'`);
        }
    }

    private expectIdentifier(): string {
        const token = this.advance();
        if (token.type !== 'identifier') {
            throw new Error(`Expected identifier but got '${token.value}'`);
        }
        return token.value;
    }

    parse(): Formula {
        return this.implies();
    }

    private implies(): Formula {
        let left = this.or();
        while (this.match('connect', "->")) {
            const right = this.implies();
            left = { kind: 'implies', left, right };
        }
        return left;
    }

    private or(): Formula {
        let left = this.and();
        while (this.match('connect', "|")) {
            const right = this.and();
            left = { kind: 'or', left, right };
        }
        return left;
    }

    private and(): Formula {
        let left = this.not();
        while (this.match('connect', "&")) {
            const right = this.not();
            left = { kind: 'and', left, right };
        }
        return left;
    }

    private not(): Formula {
        if (this.match('connect', "~")) {
            const formula = this.atom();
            return { kind: 'not', formula };
        }
        return this.quantifierOrAtom();
    }

    private quantifierOrAtom(): Formula {
        const token = this.peek();
        if (token?.type === 'keyword' && 
            (token.value === 'forall' || token.value === 'exists')) {
                const varName = this.expectIdentifier();
                this.expectSymbol('(');
                const body = this.implies();
                this.expectSymbol(')');
                return {
                    kind: token.value,
                    var: varName,
                    body
                };
            }
        return this.atom();
    }

    private atom(): Formula {
        if (this.match('symbol', '(')) {
            const expr = this.implies();
            this.expectSymbol(')');
            return {kind: 'grouping', body: expr };
        }

        const name = this.expectIdentifier();
        if (this.match('symbol', '(')) {
            const args: Term[] = [];
            if (!this.match('symbol', ')')) {
                do {
                    const termName = this.expectIdentifier();
                    args.push( { kind: 'var', name: termName });
                    if (!this.match('symbol', ',')) break;
                } while (true);
            }
            this.expectSymbol(')');
            return { kind: 'predicate', name, args };
        } else {
            return { kind: 'predicate', name, args: [] };
        }
    }
}

export function parseFormula(input: string): Formula {
    const tokens =tokenize(input);
    const parser = new Parser(tokens);
    return parser.parse();
}

function printTerm(term: Term): string {
    if (term.kind === 'var') return term.name;
    return `${term.name}(${term.args.map(printTerm).join(", ")})`;
}

function printParens(f: Formula): string {
    // if (f.kind === 'predicate' || f.kind === 'forall' || f.kind === 'exists') {
    //     return printFormula(f);
    // } else {
    //     return `(${printFormula(f)})`;
    // }
    return `${printFormula(f)}`;
}

export function equalFormula(f1: Formula, f2: Formula): boolean {
    while (f1.kind === 'grouping') f1 = f1.body;
    while (f2.kind === 'grouping') f2 = f2.body;

    if (f2.kind === 'and' && f1.kind === 'and') {
        return equalFormula(f1.left, f2.left) && equalFormula(f1.right, f2.right);
    } else if (f1.kind === 'or' && f2.kind === 'or') {
        return equalFormula(f1.left, f2.left) && equalFormula(f1.right, f2.right);
    } else if (f1.kind === 'implies' && f2.kind === 'implies') {
        return equalFormula(f1.left, f2.left) && equalFormula(f1.right, f2.right);
    } else if (f1.kind === 'not' && f2.kind === 'not') {
        return equalFormula(f1.formula, f2.formula);
    } else if (f1.kind === 'predicate' && f2.kind === 'predicate') {
        if (f1.name === f2.name) {
            if (f1.args.length === f2.args.length) {
                for (let i = 0; i < f1.args.length; i++) {
                    if (f1.args[i] !== f2.args[i]) return false;
                }
                return true;
            } else return false;
        }
        return false;
    } else {
        return false;
    }
}
//遍历树模板
export function printFormula(f: Formula): string {
    switch (f.kind) {
        case 'predicate':
            if (f.args.length === 0) return f.name;
            return `${f.name}(${f.args.map(printTerm).join(", ")})`;
        
        case 'grouping':
            return `(${printParens(f.body)})`
        case 'not':
            return `¬${printParens(f.formula)}`;

        case 'and':
            return `${printParens(f.left)} ∧  ${printParens(f.right)}`;

        case 'or':
            return `${printParens(f.left)} ∨  ${printParens(f.right)}`;

        case 'implies':
            return `${printParens(f.left)} → ${printParens(f.right)}`;

        case 'forall':
            return `∀${f.var}. ${printFormula(f.body)}`;

        case 'exists':
            return `∃${f.var}. ${printFormula(f.body)}`;
    }
    return '';
}

//const f1 = parseFormula("forall x ( P(x) -> exists y ( Q(x, y) and R(y) ))");
const f2 = parseFormula("P & ( P -> Q )");
const f3 = parseFormula("P & ( P(x) | Q | R)");
const printed = printFormula(f3);
console.log(printed);
//console.log(JSON.stringify(formula, null, 2));
