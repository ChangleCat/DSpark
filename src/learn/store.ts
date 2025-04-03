
import { create } from 'zustand'

//you can put any type here (in the store)

interface BearState {
    bears: number;
}

interface BearActions {
    increasePopulation: () => void;//no return
    removeAllBears: () => void;
}

const useBearStore = create<BearState & BearActions>((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
}));

type CounterStore={
    count:number;
    increment:()=>void;
    incrementAsync:()=>Promise<void>;
/**/
    decrement:()=>void;
};

export const useCounterStore=create<CounterStore>(
    //is create<sth>(     )
    //actually is (set)=>(an struct)
    (set)=>(
    {
    count:0,
    increment:()=>{
        set({count:1});
    },
    incrementAsync: async() =>{
        await new Promise((resolve)=>
        setTimeout(resolve,1000)
        )//stop for one second
        set({count:1});
    },
    decrement:()=>{
        set({count:-1})
    },
}
)
)//':' 用于对象字面量中定义属性和属性值。在 TypeScript 里，对象字面量中使用 : 来分隔属性名和属性值，这和 JavaScript 中的用法是一致的，只不过 TypeScript 在类型检查时会更关注属性值的类型是否符合预期。
 
export const useAnotherCounterStore=create<CounterStore>((set)=>({
    count:0,
    increment:()=>{
        set((state)=>({count:state.count+1}))
    },
    incrementAsync: async() =>{
        await new Promise((resolve)=>
        setTimeout(resolve,1000)
        )//stop for one second
        set({count:1});
    },
    decrement:()=>{
        set((state)=>({count:state.count-1}))
    }
}))
//外层花括号 ({ count: state.count + 1 }) 用于定义一个对象字面量。在 zustand（假设这是基于 zustand 状态管理库的代码）中，set 函数期望接收一个新的状态对象或者一个用于更新状态的函数。这里使用对象字面量来描述状态更新后的样子。
//如果更新逻辑更复杂，需要多条语句来计算新的状态，就需要在内层使用花括号来定义函数体，并使用 return 返回新的状态对象。例如：
/*set((state) => { 
    let newCount = state.count + 1; 
    if (newCount > 10) { 
        newCount = 10; 
    } 
    return { count: newCount }; 
});*/ 