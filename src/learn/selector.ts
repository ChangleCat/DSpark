import { create } from 'zustand';


interface BearState {
    bears: number;
    nuts: number;
    honey: number;
    treats: Record<string, any>;
}

interface BearActions {
    increasePopulation: () => void;//no return
    removeAllBears: () => void;
}

const useBearStore = create<BearState & BearActions>((set) => ({
    bears: 0,
    nuts: 0,
    honey:0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    treats: { '0': 0 }
}));

//const nutsCount:number = useBearStore((state) => state.nuts)
//const honeyCount:number = useBearStore((state) => state.honey)


//如果您想构造一个内部有多个状态选择的单一对象，类似于 redux 的 mapStateToProps ，您可以通过传递 shallow 相等函数告诉 zustand 您希望对象被浅拆分。

const { nuts: selectedNuts, honey: selectedHoney } = useBearStore(
  (state) => ({ nuts: state.nuts, honey: state.honey }),
  shallow
);
console.log(selectedNuts, selectedHoney); // Use the destructured members
  (state) => ({ nuts: state.nuts, honey: state.honey }),
const [selectedNuts, selectedHoney] = useBearStore(
  (state) => [state.nuts, state.honey],
  shallow
);
console.log(selectedNuts, selectedHoney); // Use the destructured members
const [nuts, honey] = useBearStore(
const selectedTreats = useBearStore((state) => Object.keys(state.treats), shallow);
console.log(selectedTreats); // Use the destructured members
  shallow
)

// 选择 Map, 当`state.treats`的排序、数量和 key 发生变化后, 组件重新渲染
const treats = useBearStore((state) => Object.keys(state.treats), shallow)

//为了更好地控制组件重新渲染，你可以提供任何自定义的对比函数。

const treats = useBearStore(
  (state) => state.treats,
  (oldTreats, newTreats) => compare(oldTreats, newTreats)
)