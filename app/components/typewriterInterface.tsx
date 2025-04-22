import Markdown from "react-markdown";
import { parseFormula } from "src/ast/ast";
import type { Formula } from "src/ast/ast";
import { useLevelStore } from "src/level/level";
import { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useHover, HoverProvider } from './HoverContext';

type StepData = {
  premises: Formula[];
  goal: Formula;
  userInput: string;
};

export default function TypewriterInterface() {
  // 从状态管理中获取当前关卡的信息
  const currentLevel = useLevelStore((state) => state.currentLevel);
  const [premisesList, setPremisesList] = useState<Formula[]>([]);
  const [goalStack, setGoalStack] = useState<Formula[]>([]);
  const [stepList, setStepList] = useState<StepData[]>([]);

  useEffect(() => {
    if (currentLevel == null) return;
    const { premises, goal } = currentLevel;
    setPremisesList(
      premises.split(",").map((premise) => parseFormula(premise))
    );
    setGoalStack([parseFormula(goal)]);
    setStepList([
      {
        premises: premisesList,
        goal: goalStack[goalStack.length - 1],
        userInput: "",
      },
    ]);
  }, [currentLevel]);

  if (currentLevel == null) {
    return <LevelNotFound />;
  }
  // 从当前关卡中获取简要说明、前提和目标
  const { brief, premises, goal } = currentLevel;
  return (
    <div className="flex flex-col max-h-full flex-1 bg-[#ddf6ff] shadow-sm overflow-hidden">
      <div className="flex-1 bg-white text-black p-2 pt-0">
        <ExerciseStatement markdownText={brief} />
        {stepList.map((stepData, index) => (
          <Step key={index} index={index} stepData={stepData} />
        ))}
      </div>
      {/* 输入框组件，用户可以在这里输入指令并提交 */}
      <InputBox />
    </div>
  );
}

// 步骤组件，用于显示每一步的前提和目标
function Step({ stepData, index }: { stepData: StepData; index: number }) {
  const { premises, goal, userInput } = stepData;


  const renderUserInput = () => {
    if (!userInput) return null;
    return (
      <div className="bg-[#bbb] rounded-md p-2 mb-4 flex gap-1">
        <div className="bg-white p-2 text-sm flex-1">{userInput}</div>
        <button
          type="button"
          className="bg-white rounded-sm p-1 pl-2 pr-2 flex items-center text-[#7f7f7f] hover:cursor-pointer hover:text-[#284a53]"
        >
          <Icon icon="mdi:backspace" className="mr-1 text-xl" />
          重试
        </button>
      </div>
    );
  };

  const renderPremises = () => (
    <ol className="ml-1">
      {premises.map((premise, index) => (
        <li key={index}>
          <span className="inline-block w-3 text-amber-600 font-bold">{index + 1}</span>：
          <PropositionTree tree={premise} />
        </li>
      ))}
    </ol>
  );

  return (
    <div>
      {renderUserInput()}
      <div>
        <div className="text-xl">步骤</div>
        <div className="bg-[#bbb] w-full h-1 mb-1"></div>
      </div>
      <div className="text-xl">前件：</div>
      {renderPremises()}
      <div>
        <div className="text-xl">目标：</div>
        <PropositionTree tree={goal} />
      </div>
    </div>
  );
}


interface markdownText {
  markdownText: string;
}

// 关卡不存在时的提示信息
function LevelNotFound() {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <p>关卡不存在</p>
    </div>
  );
}

// 这个组件用于显示 Markdown 格式的练习题说明
// 你可以在这里传入 Markdown 格式的文本，它会被渲染为 HTML
function ExerciseStatement({ markdownText }: markdownText) {
  return (
    <div className="markdown">
      <Markdown>{markdownText}</Markdown>
    </div>
  );
}

// TODO: 输入框组件，能够接收用户输入的指令并提交
function InputBox() {
  return (
    <div className="flex items-center p-2 bg-gray-100 rounded-md shadow-sm">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        placeholder="请输入你的指令..."
      />
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        type="button"
      >
        提交
      </button>
    </div>
  );
}

interface treeProps {
  tree: Formula;
}

function PropositionTree({ tree }: treeProps) {
 return (
    <HoverProvider>
      <RenderPropositionTree tree={tree} />
    </HoverProvider>
  );
}
function RenderPropositionTree({ tree }: treeProps) {
  const { hoveredId, setHoveredId } = useHover(); // 从 Context 获取状态和设置器
  const myId = useId(); // 每个实例的唯一 ID

  // 新的 onMouseOver 事件处理器
  const handleMouseOver = (event: React.MouseEvent<HTMLSpanElement>) => {
    // 1. 阻止事件冒泡！确保只有最深层的元素处理
    event.stopPropagation();

    // 2. 如果当前元素已经是悬停状态，则无需更新
    if (hoveredId !== myId) {
      // 3. 将当前元素的 ID 设置为全局的悬停 ID
      setHoveredId(myId);
    }
  };

  // 判断当前实例是否是全局记录的悬停实例
  const isActuallyHovered = hoveredId === myId;

  // 样式定义保持不变
  const baseClassName = "rounded-md inline-block mr-2 px-0 cursor-default align-middle";
  const hoverClassName = "bg-[#bbb]";
  const combinedClassName = `${baseClassName} ${isActuallyHovered ? hoverClassName : ''}`;

  if (!tree) {
    return <span className="text-gray-500 align-middle">Invalid formula</span>;
  }

  // 将 className 和 onMouseOver 应用到每个 case 的最外层 span
  // 移除 onMouseEnter
  switch (tree.kind) {
    case "forall":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver} // 使用 onMouseOver
          // 没有 onMouseEnter, 没有 onMouseLeave
        >
          ∀{tree.var}
          <RenderPropositionTree tree={tree.body} />
        </span>
      );
    case "exists":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          ∃{tree.var}
          <RenderPropositionTree tree={tree.body} />
        </span>
      );
    case "predicate":
      // 如果 tree.args.length === 0, 直接返回
      if (tree.args.length === 0) {
        return <span className={combinedClassName} onMouseOver={handleMouseOver}>{tree.name}</span>;
      }
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          {`${tree.name}(${tree.args.map((arg) => arg.name).join(", ")})`}
        </span>
      );
    case "and":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          <RenderPropositionTree tree={tree.left} />
          ∧{" "}
          <RenderPropositionTree tree={tree.right} />
        </span>
      );
    case "or":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          <RenderPropositionTree tree={tree.left} />
          ∨{" "}
          <RenderPropositionTree tree={tree.right} />
        </span>
      );
    case "not":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          ¬<RenderPropositionTree tree={tree.formula} />
        </span>
      );
    case "implies":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          <RenderPropositionTree tree={tree.left} />
          →{" "}
          <RenderPropositionTree tree={tree.right} />
        </span>
      );
    case "grouping":
      return (
        <span
          className={combinedClassName}
          onMouseOver={handleMouseOver}
        >
          (<RenderPropositionTree tree={tree.body} />)
        </span>
      );
    // default:
    //   return <span className="align-middle">{`Unknown: ${tree.kind}`}</span>;
  }
   return null;
}