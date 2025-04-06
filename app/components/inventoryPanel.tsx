import { Icon } from "@iconify/react/dist/iconify.js";
import copy from "copy-to-clipboard";

export default function InventoryPanel() {
  return (
    <div className="h-full w-[calc(25%-5px)] pr-2 pl-2 bg-white box-border">
      <Inventory />
    </div>
  );
}

function Inventory() {
  return (
    <div className="flex flex-col w-full">
      <Tactics />
      <Symbols />
      <Theorems />
    </div>
  );
}

function Tactics() {
  return (
    <div>
      <h2 className="mt-4 mb-1 text-2xl">命令</h2>
    </div>
  );
}

function Symbols() {
  return (
    <div>
      <h2 className="mt-4 mb-1 text-2xl">符号</h2>
    </div>
  );
}

function Theorems() {
  return (
    <div>
      <h2 className="mt-4 mb-1 text-2xl">定理</h2>
    </div>
  );
}

interface unitProps {
  name: string;
  isLocked: boolean;
}

function Unit({ name, isLocked }: unitProps) {
  let divClass = "border-1 cursor-pointer ";
  if (isLocked) {
    divClass += "text-gray-200 border-gray-200";
  }
  return (
    <div className={divClass}>
      {isLocked && <Icon icon="mdi:lock" />}
      {name}
      <div className="h-full">
        <Icon icon="mdi:content-copy" onClick={() => copy(name)} />
      </div>
    </div>
  );
}
