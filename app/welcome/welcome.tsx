import HomeHeader from "~/components/homeHeader"
import ChatPanel from "~/components/chatPanel";
import InventoryPanel from "~/components/inventoryPanel";
import TypewriterInterface from "~/components/typewriterInterface";

export function Welcome() {
  return (
    <>
      <HomeHeader />
      <main className="flex justify-between items-end w-full flex-1 bg-[#eee] gap-2.5">
        <ChatPanel />
        <TypewriterInterface />
        <InventoryPanel />
      </main>
    </>
  );
}

