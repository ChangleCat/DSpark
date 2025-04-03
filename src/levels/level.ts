//temp
//fs.readFileSync(path.resolve(filePath), 'utf8');
import fs from 'fs';
import path from 'path';



import {create} from 'zustand';


//关卡的信息
interface Level{
    id:number; //索引
    union: 0,
    chapter: 0,
    name:string; //名称
    description:string; //描述
    premises:string[]; //前提
    goal:string; //目标
    isProved:boolean; //是否被证明
}

import  level00  from './data/0-0.json'

//关卡内部的动作
//暂时先不要了
interface LevelActions{
    setLevelDescription:(level:Level,description:string)=>void;//设置关卡描述

    showAllLevelData:(level:Level)=>void;//显示单个关卡所有的数据
    showLevelId:(level:Level)=>number;//显示索引
    showLevelName:(level:Level)=>string;//显示关卡字符串
    showLevelDescription:(level:Level)=>string;//显示关卡描述
    showLevelPremises:(level:Level)=>string[];//显示前提
    showLevelGoal:(level:Level)=>string;//显示目标
    showLevelIsProved:(level:Level)=>boolean;//显示是否被证明
}

//所有关卡的状态
interface LevelState{
    //levels:Level[];//存储所有关卡
    currentLevelIndex:number; //当前关卡索引
    showDescription:(level:Level)=>void;//显示关卡描述
}

export const useLevelStore=create<LevelState>((set)=>({
    levels:[],
    currentLevelIndex:0,
    showDescription:(level:Level)=>{return level.description;},
}))