import type { Route } from "./+types/home";
import { Welcome } from "~/interface/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "首页 | DSpark" },
    { name: "description", content: "欢迎来到DSpark！" },
  ];
}

export default function Home() {
  return <Welcome />;
}
