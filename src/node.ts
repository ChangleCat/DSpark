export enum TermType {
  CONST,
  VAR
}

export class Term {
  constructor(public readonly type: TermType, public readonly name: string) {}

  toString(): string {
    return this.name;
  }

  equals(other: Term): boolean {
    return other instanceof Term && other.name === this.name;
  }
}

// 基础命题类型
  export abstract class Proposition {
    abstract toString(): string;
    abstract equals(other: Proposition): boolean;
  }

  export class Grouping extends Proposition {
    constructor(public readonly propos: Proposition) {
      super();
    }

    toString(): string {
      return `(${this.propos.toString()})`
    }

    equals(other: Proposition): boolean {
      return this.propos.equals(other);
    }
  }
  
  // 原子命题 (量词 P(x, y) )
  export class Atomic extends Proposition {
    constructor(
      public readonly symbol: string, 
      public readonly terms: Term[] = []) {
      super();
    }
  
    toString(): string {
      return this.terms.length > 0 
        ? `${this.symbol}(${this.terms.join(',')})`
        : this.symbol;
    }
  
    equals(other: Proposition): boolean {
      if (!(other instanceof Atomic)) return false;
        
      if (this.symbol !== other.symbol) return false;
      
      if (this.terms.length !== other.terms.length) return false;
      
      return this.terms.every((term, index) => 
          term.equals(other.terms[index])
      );
    }
  }
  
  // 否定命题 (¬P)
  export class Negation extends Proposition {
    constructor(public readonly proposition: Proposition) {
      super();
    }
  
    toString(): string {
      return `~${this.proposition.toString()}`;
    }
  
    equals(other: Proposition): boolean {
      return other instanceof Negation && this.proposition.equals(other.proposition);
    }
  }
  
  // 合取命题 (P ∧ Q)
  export class Conjunction extends Proposition {
    constructor(
      public readonly left: Proposition,
      public readonly right: Proposition
    ) {
      super();
    }
  
    toString(): string {
      return `(${this.left.toString()} & ${this.right.toString()})`;
    }
  
    equals(other: Proposition): boolean {
      return other instanceof Conjunction && 
             this.left.equals(other.left) && 
             this.right.equals(other.right);
    }
  }
  
  // 析取命题 (P ∨ Q)
  export class Disjunction extends Proposition {
    constructor(
      public readonly left: Proposition,
      public readonly right: Proposition
    ) {
      super();
    }
  
    toString(): string {
      return `(${this.left.toString()} V ${this.right.toString()})`;
    }
  
    equals(other: Proposition): boolean {
      return other instanceof Disjunction && 
             this.left.equals(other.left) && 
             this.right.equals(other.right);
    }
  }
  
  // 蕴含命题 (P → Q)
  export class Implication extends Proposition {
    constructor(
      public readonly antecedent: Proposition,
      public readonly consequent: Proposition
    ) {
      super();
    }
  
    toString(): string {
      return `(${this.antecedent.toString()} -> ${this.consequent.toString()})`;
    }
  
    equals(other: Proposition): boolean {
      return other instanceof Implication && 
             this.antecedent.equals(other.antecedent) && 
             this.consequent.equals(other.consequent);
    }
  }
  
  // 双向蕴含命题 (P ↔ Q)
  export class Biconditional extends Proposition {
    constructor(
      public readonly left: Proposition,
      public readonly right: Proposition
    ) {
      super();
    }
  
    toString(): string {
      return `(${this.left.toString()} <-> ${this.right.toString()})`;
    }
  
    equals(other: Proposition): boolean {
      return other instanceof Biconditional && 
             this.left.equals(other.left) && 
             this.right.equals(other.right);
    }
  }
  
  // 使用示例
  const P = new Atomic('P');
  const Q = new Atomic('Q');
  const R = new Atomic('R');
  
  const notP = new Negation(P);
  const P_and_Q = new Conjunction(P, Q);
  const P_or_Q = new Disjunction(P, Q);
  const P_implies_Q = new Implication(P, Q);
  const P_iff_Q = new Biconditional(P, Q);
  
  console.log(notP.toString());        // 输出: ¬P
  console.log(P_and_Q.toString());     // 输出: (P ∧ Q)
  console.log(P_or_Q.toString());      // 输出: (P ∨ Q)
  console.log(P_implies_Q.toString()); // 输出: (P → Q)
  console.log(P_iff_Q.toString());     // 输出: (P ↔ Q)
  
  // 更复杂的嵌套表达式
  const complexExpr = new Implication(
    new Conjunction(P, new Negation(Q)),
    new Disjunction(R, new Biconditional(P, Q))
  );
  console.log(complexExpr.toString()); // 输出: ((P ∧ ¬Q) → (R ↔ (P ↔ Q)))