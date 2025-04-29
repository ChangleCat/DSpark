import Markdown from "react-markdown";
import { parseFormula } from "src/ast/ast";
import type { Formula } from "src/ast/ast";
import { useLevelStore } from "src/level/level";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { BaseRule, Theorem } from "src/rule/rule";
import { infer } from "src/rule/rule";
import { PropositionTree } from "./PropositionTree"

type StepData = {
  premisesList: Formula[];
  goalStack: Formula[];
  userInput: string;
};

export default function TypewriterInterface() {
  // 从状态管理中获取当前关卡的信息
  const currentLevel = useLevelStore((state) => state.currentLevel);
  const [stepList, setStepList] = useState<StepData[]>([]);

  // 设置当前关卡的前提和目标
  function pushStep(step: StepData) {
    setStepList((prev) => [...prev, step]);
  }

  useEffect(() => {
    if (currentLevel == null) return;
    const { premises, goal } = currentLevel;
    const initialPremisesList = premises.split(",").map((premise) => parseFormula(premise));
    const initialGoalStack = [parseFormula(goal)];
    setStepList([
      {
        premisesList: initialPremisesList,
        goalStack: initialGoalStack,
        userInput: "",
      },
    ]);
  }, [currentLevel]);

  if (currentLevel == null) {
    return <LevelNotFound />;
  }
  const currentStep = stepList[stepList.length - 1];
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
      <InputBox pushStep={pushStep} curStep={currentStep}/>
    </div>
  );
}

// 步骤组件，用于显示每一步的前提和目标
function Step({ stepData, index }: { stepData: StepData; index: number }) {
  const { premisesList, goalStack, userInput } = stepData;
  const currentGoal = goalStack[goalStack.length - 1];

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
      {premisesList.map((premise, index) => (
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
        <PropositionTree tree={currentGoal} />
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
function ExerciseStatement({ markdownText }: markdownText) {
  return (
    <div className="markdown">
      <Markdown>{markdownText}</Markdown>
    </div>
  );
}

interface InputBoxProps { 
  pushStep: (step: StepData) => void,
  curStep: StepData
}

// TODO: 输入框组件，能够接收用户输入的指令并提交
function InputBox({ curStep, pushStep }: InputBoxProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    try {
      // 解析用户输入的指令
      const tokens = input.split(" ");
      const command = tokens[0];
      let rule: BaseRule | Theorem;

      switch (command) {
        case "and-i": {
          const left = curStep.premisesList[parseInt(tokens[1])-1];
          const right = curStep.premisesList[parseInt(tokens[2])-1];
          rule = { kind: "and-I", left, right };
          break;
        }
        case "and-e": {
          const formula = curStep.premisesList[parseInt(tokens[1])-1];
          const side = tokens[2] === "left" ? "left" : "right";
          rule = { kind: "and-E", formula, side };
          break;
        }
        case "or-i": {
          const left = curStep.premisesList[parseInt(tokens[1])-1];
          const right = curStep.premisesList[parseInt(tokens[2])-1];
          rule = { kind: "or-I", left, right };
          break;
        }
        case "or-e": {
          const or = parseFormula(tokens[1]);
          const left = parseFormula(tokens[2]);
          const right = parseFormula(tokens[3]);
          rule = { kind: "or-E", or, left, right };
          break;
        }
        case "implies-e": {
          const left = curStep.premisesList[parseInt(tokens[1])-1];
          const right = curStep.premisesList[parseInt(tokens[2])-1];
          rule = { kind: "implies-E", left, right };
          break;
        }
        case "implies-i": {
          const left = parseFormula(tokens[1]);
          const right = parseFormula(tokens[2]);
          rule = { kind: "implies-I", left, right };
          break;
        }
        case "not-i": {
          const left = parseFormula(tokens[1]);
          const right = parseFormula(tokens[2]);
          rule = { kind: "not-I", left, right };
          break;
        }
        case "not-e": {
          const left = parseFormula(tokens[1]);
          const right = parseFormula(tokens[2]);
          rule = { kind: "not-E", left, right };
          break;
        }
        case "⊥-e": {
          const F = parseFormula(tokens[1]);
          const formula = parseFormula(tokens[2]);
          rule = { kind: "⊥-E", F, formula };
          break;
        }
        case "double-not-e": {
          const formula = curStep.premisesList[parseInt(tokens[1])-1];
          rule = { kind: "double-not-E", formula };
          break;
        }
        case "double-not-i": {
          const formula = curStep.premisesList[parseInt(tokens[1])-1];
          rule = { kind: "double-not-I", formula };
          break;
        }
        case "mt": {
          const left = curStep.premisesList[parseInt(tokens[1])-1];
          const right = curStep.premisesList[parseInt(tokens[2])-1];
          rule = { kind: "MT", left, right};
          break;
        }
        default:
          throw new Error("未知的指令");
      }

      // 调用 infer 函数
      const result = infer(rule);

      // 更新步骤数据
      pushStep({
        premisesList: [...curStep.premisesList, result], // 可根据需要更新前提列表
        goalStack: curStep.goalStack, // 将推导结果作为新的目标
        userInput: input,
      });

      // 清空输入框
      setInput("");
    } catch (error) {
      console.error("解析指令失败:", error);
      alert("输入的指令无效，请检查格式！");
    }
  };

  return (
    <div className="flex items-center p-2 bg-gray-100 rounded-md shadow-sm">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        placeholder="请输入你的指令..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        type="button"
        onClick={handleSubmit}
      >
        提交
      </button>
    </div>
  );
}