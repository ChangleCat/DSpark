import Markdown from "react-markdown";
import { useLevelStore } from "public/levels/level";

export default function ChatPanel() {
  useLevelStore().loadLevel(0,0);
  const currentLevel = useLevelStore((state) => state.currentLevel);
  console.log("markdownText", currentLevel);
  if (!currentLevel) {
    return <div className="h-full w-[calc(25%-5px)] pr-2 pl-2 bg-white overflow-auto">Loading...</div>;
  }
  
  return (
    <div className="h-full w-[calc(25%-5px)] pr-2 pl-2 bg-white overflow-auto">
      <ChatContainer markdownText={currentLevel.description}/>
    </div>
  );
}

function ChatContainer({ markdownText }: { markdownText: string }) {
  let test_markdown = `
好的，对于新手团队来说，掌握一个清晰、安全的 Git 工作流程至关重要。下面是一个适合你们三人团队的、相对简单且实用的 Git 工作流程，以及详细的步骤说明：

核心原则：

1.  \`main\` 分支是神圣的: \`main\` 分支（有些仓库可能叫 \`master\`）应该 始终 保持稳定、可运行的状态。绝不能直接在 \`main\` 分支上开发或提交未测试的代码。
2.  分支开发: 任何 新功能、Bug 修复、甚至是小的修改，都应该在一个 新的、独立的 分支上进行。
3.  频繁提交，小步快跑: 将你的工作分解成小的、逻辑相关的单元，并经常提交 (commit)。这使得追踪变更、回滚错误更容易。
4.  清晰的提交信息: 编写简洁明了的 Commit Message，说明 做了什么 (What) 以及 为什么 (Why，如果必要)。
5.  先拉后推 (Pull before Push): 在推送你的本地分支到远程之前，特别是准备合并回 \`main\` 之前，先拉取 \`main\` 分支的最新代码，解决可能存在的冲突。
6.  使用 Pull Requests (或 Merge Requests): 这是将你的功能分支合并回 \`main\` 的标准方式。它提供了代码审查、讨论和自动化检查的机会。
7.  沟通: 告诉队友你正在做什么，特别是当你要创建一个 PR 或遇到合并冲突时。

推荐的工作流程：Feature Branch Workflow + Pull Requests

这个流程可以确保 \`main\` 分支的稳定，并让团队成员并行工作，通过 Pull Request 进行代码审查和合并。

详细步骤：

1. 克隆仓库 (每个成员只需做一次)
    `;

  return (
    <div className="flex flex-col gap-2 p-2 box-border">
      <Message markdownText={markdownText} />
    </div>
  );
}

interface MsgParams {
  markdownText: string;
}

function Message({ markdownText }: MsgParams) {
  return (
    <div className="markdown w-full bg-[#ddf6ff] text-black p-2 rounded-sm">
      <Markdown>{markdownText}</Markdown>
    </div>
  );
}
