import HomeHeader from "~/components/homeHeader"
import ChatPanel from "~/components/chatPanel";
import InventoryPanel from "~/components/inventoryPanel";

export function Welcome() {
  return (
    <>
      <HomeHeader />
      <main className="flex justify-between align-bottom w-full flex-1 bg-[#eee]">
        <ChatPanel />
        <InventoryPanel />
      </main>
    </>
  );
}

