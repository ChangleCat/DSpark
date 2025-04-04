import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { create } from 'zustand';

// 引入默认关卡
import level00 from './data/0-0.json'; // 默认关卡

// 关卡的信息
interface Level {
    id: number; // 总索引
    union: number; // 大关卡索引
    chapter: number; // 小关卡索引
    name: string; // 名称
    description: string; // 描述
    premises: string[]; // 前提
    goal: string; // 目标
    isProved: boolean; // 是否被证明
}

// 读取json文件
const readJsonFile = async <T>(fileName: string): Promise<T | null> => {
    try {
        const data = await promisify(fs.readFile)(path.resolve(fileName), 'utf8');
        return JSON.parse(data) as T;
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return null;
    }
};

// 读取markdown文件
const readMarkdownFile = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(filePath), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// 所有关卡的状态
interface LevelState {
    levels: Level[]; // 存储所有关卡
    currentLevelIndex: number; // 当前关卡索引
    showDescription: (level: Level) => void; // 显示关卡描述
    loadLevel: (union: number, chapter: number) => void; // 新增加载关卡函数
}

export const useLevelStore = create<LevelState>((set) => ({
    levels: [],
    currentLevelIndex: 0,
    showDescription: (level: Level) => {
        return level.description;
    },
    loadLevel: async (union: number, chapter: number) => {
        const jsonFileName = `./data/${union}-${chapter}.json`;
        const markdownFilePath = `./data/${union}-${chapter}.md`;

        const jsonData = await readJsonFile<Level>(jsonFileName);
        if (!jsonData) {
            return;
        }

        const markdownContent = await readMarkdownFile(markdownFilePath);
        jsonData.description = markdownContent;

        set((state) => {
            const newLevels = [...state.levels, jsonData];
            const newIndex = newLevels.length - 1;
            return {
               ...state,
                levels: newLevels,
                currentLevelIndex: newIndex
            };
        });
    }
}));

// 当前关卡的状态
interface currentLevelState {
    currentLevel: Level; // 当前关卡
    setCurrentLevel: (union: number, chapter: number) => void; // 设置当前关卡
}

// 使用zustand来管理当前关卡的状态
export const useCurrentLevelStore = create<currentLevelState>((set) => ({
    currentLevel: level00, // 默认关卡
    setCurrentLevel: async (union: number, chapter: number) => {
        const levelStore = useLevelStore.getState();
        await levelStore.loadLevel(union, chapter);
        const newIndex = levelStore.currentLevelIndex;
        const newLevel = levelStore.levels[newIndex];
        set({ currentLevel: newLevel });
    }
}));


