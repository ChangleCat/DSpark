import { Token, TokenType } from "../token";

//扫描器，将字符串转化为 Token[]
export class Scanner { 
    //保留关键字
    private static keywords: Map<string, TokenType> = new Map([
    ['forall', TokenType.FORALL],
    ['exists', TokenType.EXISTS]
    ]);

    //state
    private static instance: Scanner;
    private source: string = "";
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;

    private constructor() {}

    public static getInstance(): Scanner {
        if (!Scanner.instance) {
            Scanner.instance = new Scanner();
        }
        return Scanner.instance;
    }

    setInput(s: string): void {
        this.source = s;
        this.reset();
    }

    reset(): void {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    static scanString(source: string): Token[] {
        const scanner = Scanner.getInstance();
        scanner.setInput(source);
        return scanner.scanTokens();
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.END, "", this.start + 1, this.current, this.line));
        return this.tokens;
    }

    private scanToken(): void {
        const c = this.advance();
        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case '[': this.addToken(TokenType.LEFT_SQUAR); break;
            case ']': this.addToken(TokenType.RIGHT_SQUAR); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.POINT); break;
            case '&': this.addToken(TokenType.AND); break;
            case '|': this.addToken(TokenType.OR); break;
            case '~': this.addToken(TokenType.NOT); break;
            case '-': 
                if (this.match('>')) this.addToken(TokenType.IF); 
                break;
            case '<': 
                if (this.match('-') && this.match('>')) this.addToken(TokenType.IFF); 
                break;
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n': this.line++; break;
            default:
                if (this.isAlpha(c)) {
                    if (this.isUpperCase(c)) {
                        this.identifier();
                    } else {
                        this.variable();
                    }
                } else {
                    // Replace Prelog::error with your error handling
                    console.error(`Error at line ${this.line}, positions ${this.start}-${this.current}: Unexpected character.`);
                }
                break;
        }
    }

    private identifier(): void {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.substring(this.start, this.current);
        let type = Scanner.keywords.get(text) || TokenType.IDENTIFIRE;
        this.addToken(type);
    }

    private variable(): void {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.substring(this.start, this.current);
        let type = Scanner.keywords.get(text) || TokenType.VAR;
        this.addToken(type);
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;

        this.current++;
        return true;
    }

    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.current + 1);
    }

    private addToken(type: TokenType): void {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, this.start, this.current, this.line));
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || (c >= '0' && c <= '9');
    }

    private isUpperCase(c: string): boolean {
        return c >= 'A' && c <= 'Z';
    }
}