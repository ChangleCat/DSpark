export interface BaseRule {// 基本规则接口
    id: number; // 规则的唯一标识符
    name: string; // 规则的名称
    formula: string; // 规则的公式
    command: string; // 规则的命令
    description: string; // 规则的描述
}

export interface Theory {// 规则接口
    id: number; // 规则的唯一标识符
    name: string; // 规则的名称
    formula: string; // 规则的公式
    command: string; // 规则的命令
    description: string; // 规则的描述
}


