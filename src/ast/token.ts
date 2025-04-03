export enum TokenType {
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE, LEFT_SQUAR, RIGHT_SQUAR,
    COMMA, POINT,
    IDENTIFIRE, VAR,
    AND, OR, NOT, IF, IFF,
    FORALL, EXISTS,
    P, Q, R,
    END
}

export class Token {
    constructor(
        public readonly type: TokenType,
        public readonly lexeme: string,
        public readonly start: number,
        public readonly end: number,
        public readonly line: number
    ) {}

    toString(): string {
        const typeStr = TokenType[this.type] || "UNKNOWN";
        return `[@${this.line},${this.start}:${this.end}='${this.lexeme}',<${typeStr}>]`;
    }

    print(): void {
        console.log(this.toString());
    }
}