import HomeHeader from "~/components/homeHeader"
import ChatPanel from "~/components/chatPanel";
import InventoryPanel from "~/components/inventoryPanel";
import TypewriterInterface from "~/components/typewriterInterface";

export function LevelInterface() {
  return (
    <div className="flex flex-col h-full w-full">
      <HomeHeader />
      <main className="flex justify-between items-end w-full flex-1 bg-[#eee] gap-2.5 overflow-auto">
        <ChatPanel />
        <TypewriterInterface />
        <InventoryPanel />
      </main>
    </div>
  );
}

