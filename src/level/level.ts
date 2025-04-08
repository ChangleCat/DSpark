import { create } from 'zustand';

import level00 from './level_data/0-0.json'

// 关卡的信息
interface Level {
    id: number;
    union: number;
    chapter: number;
    name: string;
    brief: string;
    description: string;
    premises: string;
    goal: string;
    isProved: boolean;
}

// 所有关卡的状态
interface LevelState {
    currentLevel: Level | null;
    markdownData: string;
    loadLevel: (union: number, chapter: number) => void;
    error: string | null;
}

export const useLevelStore = create<LevelState>((set) => ({
    currentLevel: level00,
    markdownData: '',
    error: null,
    loadLevel: (union: number, chapter: number) => {
        fetch(`http://localhost:5173/level/${union}-${chapter}`)
          .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
          .then(data => {
                set({
                    currentLevel: data,
                    markdownData: data.description,
                    error: null
                });
            })
          .catch(error => {
                set({
                    currentLevel: null,
                    markdownData: '',
                    error: error.message
                });
                console.error('Error loading level:', error);
            });
    }
}));