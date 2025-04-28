import { useId } from 'react';
import { useHover, HoverProvider } from './HoverContext';
import type { Formula } from "src/ast/ast";

interface treeProps {
  tree: Formula;
}

export function PropositionTree({ tree }: treeProps) {
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