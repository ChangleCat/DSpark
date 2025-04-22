// HoverContext.tsx 或放在你的组件文件顶部
import React, { createContext, useState, useContext } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

// 定义 Context 提供的值的类型
interface HoverContextProps {
  hoveredId: string | null; // 当前悬停元素的唯一 ID，null 表示没有元素悬停
  setHoveredId: Dispatch<SetStateAction<string | null>>; // 更新悬停 ID 的函数
}

// 创建 Context，提供一个默认值（可以是 undefined 或 null，但要指定类型）
const HoverContext = createContext<HoverContextProps | undefined>(undefined);

// 创建一个 Provider 组件
export const HoverProvider = ({ children }: { children: ReactNode }) => {
  // 使用 useState 管理当前悬停的元素 ID
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 这个函数用于当鼠标离开整个容器区域时清除悬停状态
  const handleMouseLeaveContainer = () => {
    setHoveredId(null);
  };

  return (
    // 提供 hoveredId 和 setHoveredId 给子组件
    <HoverContext.Provider value={{ hoveredId, setHoveredId }}>
      {/* 在 Provider 渲染的根 div 上监听 mouseleave 事件 */}
      <div onMouseLeave={handleMouseLeaveContainer} className='inline-block'>
        {children}
      </div>
    </HoverContext.Provider>
  );
};

// 创建一个自定义 Hook，方便消费 Context
export const useHover = (): HoverContextProps => {
  const context = useContext(HoverContext);
  if (context === undefined) {
    // 确保 useHover 在 HoverProvider 内部使用
    throw new Error('useHover 必须在 HoverProvider 内部使用');
  }
  return context;
};