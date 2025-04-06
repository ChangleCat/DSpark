import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { create } from 'zustand';

// 引入默认关卡
import level00 from './level_data/0-0.json'; // 默认关卡

// 关卡的信息
interface Level {
    id: number; // 总索引
    union: number; // 大关卡索引
    chapter: number; // 小关卡索引
    name: string; // 名称
    brief: string; // 简介
    description: string; // 描述
    premises: string; // 前提
    goal: string; // 目标
    //ruleId: number[]; // 可用的规则
    isProved: boolean; // 是否被证明
}

// 读取json文件
const readJsonFile = async <Level>(fileName: string): Promise<Level | null> => {
    try {
        const data = await promisify(fs.readFile)(path.resolve(fileName), 'utf8');
        return JSON.parse(data) as Level;
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
    currentLevel: Level; // 当前关卡 
    showDescription: (level: Level) => void; // 显示关卡描述
    loadLevel: (union: number, chapter: number) => void; // 加载关卡
}

export const useLevelStore = create<LevelState>((set) => ({
    currentLevel: level00, // 默认关卡
    showDescription: (currentLevel: Level) => {
        return currentLevel.description;
    },
    loadLevel: async (union: number, chapter: number) => {
        const jsonPath = `./level_data/${union}-${chapter}.json`;
        const markdownPath = `./level_data/${union}-${chapter}.md`;

        const jsonData = await readJsonFile<Level>(jsonPath);
        if (!jsonData) {
            return;
        }

        const markdownData = await readMarkdownFile(markdownPath);
        jsonData.description = markdownData;

        set((state) => ({
            currentLevel: jsonData,
        }));
    },
    
}));



