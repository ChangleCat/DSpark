export interface Level {
    id: string;
    name: string;
    description: string;
    premises: string[]; // 公式暂时还是字符串
    goal: string;       // 公式暂时还是字符串
    isProved:boolean;
  }