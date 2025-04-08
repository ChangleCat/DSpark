import { create } from 'zustand';

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
    isProved: boolean; // 是否被证明
}

// 所有关卡的状态
interface LevelState {
    currentLevel: Level | null; // 当前关卡
    loadLevel: (union: number, chapter: number) => Promise<void>; // 加载关卡
}

export const useLevelStore = create<LevelState>((set) => ({
    currentLevel: null, // 默认关卡为空

    loadLevel: async (union: number, chapter: number) => {
        const jsonPath = `/src/level/level_data/${union}-${chapter}.json`;
        const markdownPath = `/src/level/level_data/${union}-${chapter}.md`;

        try {
            // 读取 JSON 文件
            const jsonResponse = await fetch(jsonPath);
            if (!jsonResponse.ok) {
                throw new Error('Failed to fetch JSON file');
            }
            const jsonData: Level = await jsonResponse.json();

            // 读取 Markdown 文件
            const markdownResponse = await fetch(markdownPath);
            if (!markdownResponse.ok) {
                throw new Error('Failed to fetch Markdown file');
            }
            const markdownData = await markdownResponse.text();

            // 用 Markdown 内容更新 description 字段
            jsonData.description = markdownData;

            // 更新状态
            set({
                currentLevel: jsonData
            });
        } catch (error) {
            console.error('Error loading level:', error);
        }
    },
}));
    