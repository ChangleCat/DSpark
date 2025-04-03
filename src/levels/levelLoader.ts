// src/levels/levelLoader.ts
<<<<<<< HEAD
import type{ Level } from './levelTypes';
// 这种导入方式在 Vite 中通常可行
import level1Data from './data/intro-1.json';
import level2Data from './data/modus-ponens.json'; // 假设你创建了它

// 类型断言，因为直接导入JSON可能类型是 any 或 unknown
const level1: Level = level1Data as Level;
const level2: Level = level2Data as Level;

const levelsDatabase: Record<string, Level> = {
  [level1.id]: level1,
  [level2.id]: level2,

import type { Level } from './levelTypes';
// 这种导入方式在 Vite 中通常可行

import level1Data  from './data/intro-1.json';
//import level2Data from './data/modus-ponens-1.json'; // 假设你创建了它

// 类型断言，因为直接导入JSON可能类型是 any 或 unknown
const level1: Level = level1Data as Level;
//const level2: Level = level2Data as Level;

const levelsDatabase: Record<string, Level> = {
  [level1.id]: level1,
  //[level2.id]: level2,
>>>>>>> 881730d29401e7ed8c71e72c177d34eb025dc89a
};

export function loadLevelData(levelId: string): Level | undefined {
  console.log(`Attempting to load level: ${levelId}`); // 加个日志方便调试
  return levelsDatabase[levelId];
<<<<<<< HEAD
}
=======
}

>>>>>>> 881730d29401e7ed8c71e72c177d34eb025dc89a
