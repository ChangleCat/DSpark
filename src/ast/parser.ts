import { Token, TokenType } from "./token";
import { Proposition, Atomic, Disjunction, Conjunction, 
        Implication, Biconditional, Term, TermType,
        Negation, Grouping } from "./lexer/node";
import { scan } from "./lexer";

class ParseError {
    message: string = "";

    constructor(message?: string) {
        if (message)
        this.message = message;
    }
}
export class Parser {
    private static instance : Parser;
    private tokens: Token[] = [];
    private current: number = 0;
    private parError: ParseError = new ParseError();
    private inputReady = false;

    private constructor() {}

    public static getInstance() {
        if (!Parser.instance) {
            Parser.instance = new Parser();
        }
        return Parser.instance;
    }

    setInput(tokens: Token[]): void {
        this.tokens = [...tokens];
        this.current = 0;
        this.inputReady = true;
    }

    parse(tokens: Token[]): Proposition | null {
        let parser = Parser.getInstance();
        parser.setInput(tokens);
        return parser.proposition();
    }

    proposition(): Proposition | null {
        if (this.inputReady) {
            try {
                return this.impbic();
            } catch (error) {
                if (error instanceof ParseError) {
                   
                    console.log("Error: " + error.message)
                    return null;
                }
                throw error;
            } finally {
                this.inputReady = false;
            }
        }
        return null;
    }

    impbic(): Proposition {
        let propos = this.condis();

        while(this.match(TokenType.IF, TokenType.IFF)) {
            const type = this.previous().type;
            const right = this.condis();
            if (type == TokenType.IF) {
                console.log("if");
                propos = new Implication(propos, right);
            }
            if (type == TokenType.IFF) {
                console.log("iff");
                propos = new Biconditional(propos, right);
            }
        }

        return propos;
    }

    condis(): Proposition {
        let propos = this.negati();

        while (this.match(TokenType.AND, TokenType.OR)) {
            const type = this.previous().type;           
            const right = this.negati();
            if (type == TokenType.AND) {
                console.log("and");
                propos = new Conjunction(propos, right);
            }
            if (type == TokenType.OR) {
                console.log("or");
                propos = new Disjunction(propos, right);
            }
        }

        return propos;
    }

    negati(): Proposition {
        while (this.match(TokenType.NOT)) {
            console.log("not");
            const right = this.negati();
            return new Negation(right);
        }
        return this.atomic();
    }

    atomic(): Proposition {
        if (this.match(TokenType.IDENTIFIRE)) {
            console.log("atomic symbol");
            const name = this.previous().lexeme;
            return new Atomic(name);
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            console.log("left_paren");
            const propos = this.impbic();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')'");
            console.log("right_paren");
            return new Grouping(propos);
        }

        if (this.match(TokenType.RIGHT_PAREN)) {
            throw this.error(this.peek(), "Expect '('");
        }

        throw this.error(this.peek(), "Expect proposition");
    }

    consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    error(token: Token, message: string): ParseError {
        return new ParseError(message);
    }

    match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    peek(): Token {
        return this.tokens[this.current];
    }

    previous(): Token {
        return this.tokens[this.current - 1];
    }

    isAtEnd(): boolean {
        return this.current >= this.tokens.length;
    }
}

//test

//~P
//(P & Q)
//(P V Q)
//(P -> Q)
//(P <-> Q)
//((P & ~Q) -> (R V (P <-> Q)))

let tokens = scan("(P -> Q)");
let propos = Parser.getInstance().parse(tokens);
if (propos instanceof Grouping) {
    propos as Grouping;
    console.log("Grouping");
    if (propos.propos instanceof Implication) {
        console.log("Implication");
        propos.propos as Implication;
        if (propos.propos.consequent instanceof Atomic) {
            console.log("Atomic");
        }
    }
}
console.log(propos?.toString());
