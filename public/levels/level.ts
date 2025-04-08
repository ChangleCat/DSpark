import fs from 'fs';
import path from 'path';
import { create } from 'zustand';

// 引入默认关卡
import level00 from'public/levels/level_data/0-0.json'; // 默认关卡

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
const readJsonFile = <T>(fileName: string, callback: (err: Error | null, data?: T) => void) => {
    fs.readFile(path.resolve(fileName), 'utf8', (err, content) => {
        if (err) {
            console.error(`Error reading ${fileName}:`, err);
            callback(err);
            return;
        }
        try {
            const jsonData = JSON.parse(content) as T;
            callback(null, jsonData);
        } catch (parseError) {
            console.error(`Error parsing ${fileName}:`, parseError);
            callback(parseError as Error);
        }
    });
};

// 读取markdown文件
const readMarkdownFile = (filePath: string, callback: (err: Error | null, data?: string) => void) => {
    fs.readFile(path.resolve(filePath), 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${filePath}:`, err);
            callback(err);
            return;
        }
        callback(null, data);
    });
};

// 所有关卡的状态
interface LevelState {
    currentLevel: Level; // 当前关卡 
    markdownData: string; // 当前关卡的markdown数据
    loadLevel: (union: number, chapter: number) => void; // 加载关卡
}

export const useLevelStore = create<LevelState>((set) => ({
    currentLevel: level00, // 默认关卡
    markdownData: '', // 默认markdown数据

    loadLevel: (union: number, chapter: number) => {
        const jsonPath = `src/levels/level_data/${union}-${chapter}.json`;
        const markdownPath = `src/levels/level_data/${union}-${chapter}.md`;

        readJsonFile<Level>(jsonPath, (jsonErr, jsonData) => {
            if (jsonErr ||!jsonData) {
                return;
            }

            readMarkdownFile(markdownPath, (mdErr, markdownData) => {
                if (mdErr ||!markdownData) {
                    return;
                }

                jsonData.description = markdownData;
                // 更新关卡状态和markdown数据
                set((state) => ({
                    currentLevel: jsonData,
                    markdownData: markdownData
                }));
            });
        });
    },

}));