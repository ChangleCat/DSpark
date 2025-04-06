import Markdown from "react-markdown";

export default function TypewriterInterface() {
  return (
    <div className="flex flex-col max-h-full flex-1 bg-[#ddf6ff] shadow-sm overflow-hidden">
      <div className="flex-1 bg-white text-black p-2 pt-0">
        <ExerciseStatement markdownText="事情是这样的"/>
        
      </div>
      <InputBox />
    </div>
  );
}

interface markdownText {
  markdownText: string;
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
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="button">
        提交
      </button>
    </div>
  );
}


// TODO: 渲染Proposition树为span树状表达式，优先级和括号处理
function renderPropositionTree(tree: any) {
  if (tree === null) {
    return null;
  }

  if (typeof tree === "string") {
    return <span>{tree}</span>;
  }

  const { value, left, right } = tree;

  return (
    <span>
      {renderPropositionTree(left)} {value} {renderPropositionTree(right)}
    </span>
  );
}