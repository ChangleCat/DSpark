import { Scanner } from './scanner';
import { Token } from '../token';

export function scan(source: string): Token[] {
    return Scanner.scanString(source);
}

// let tokens : Token[] = scan("(P -> Q)");

// for (const token of tokens) {
//     console.log(token.toString());
// }