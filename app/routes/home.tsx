import type { Route } from "./+types/home";
import { Welcome } from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "首页 | DSpark" },
    { name: "description", content: "欢迎来到DSpark！" },
  ];
}

export default function Home() {
  return <Welcome />;
}
