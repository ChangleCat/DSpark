import { useLevelStore } from "src/level/level";
import type { Route } from "./+types/home";
import { Welcome } from "~/interface/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "首页 | DSpark" },
    { name: "description", content: "欢迎来到DSpark！" },
  ];
}

export default function Home() {
  const LevelStore = useLevelStore.getState();
  LevelStore.loadLevel(0, 0).catch((error) => {
    console.error("Error loading level:", error);
  });
  return <Welcome />;
}
