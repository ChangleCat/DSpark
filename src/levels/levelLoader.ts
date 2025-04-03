import { create } from 'zustand'
import { Level } from '../levels/levelTypes';
//import intro from './data/intro.json';
import levelData1 from'./data/modus-ponens.json';

const levelsDatabase: Record<number, Level> = {
  [intro.id]: intro as Level,
  [levelData1.id]: levelData1 as Level,
};

export function loadLevelData(levelId: number): Level | undefined {
  console.log(`Attempting to load level: ${levelId}`); // 加个日志方便调试
  return levelsDatabase[levelId];
}
