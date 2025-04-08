import type { Route } from "./+types/level";
import { LevelInterface } from "~/interface/levelInterface";
import { useLevelStore } from "src/level/level";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Level-${params.levelId} | DSpark` },
    { name: "description", content: "欢迎来到DSpark！" },
  ];
}

export default function Level({ params }: Route.LoaderArgs) {
  const { levelId } = params;
  // TODO: 处理错误
  if (!levelId) {
    throw new Error("Level ID is required");
  }
  const [union, chapter] = levelId.split("-").map(Number);
//   if (isNaN(union) || isNaN(chapter)) {
//     throw new Error("Invalid level ID format");
//   }
  // console.log("Loading level:", union, chapter);
  useLevelStore((state) => state.loadLevel(union, chapter));
  if (!useLevelStore.getState().currentLevel) {
    useLevelStore((state) => state.loadLevel(0, 0));
  }
  return <LevelInterface />;
}
