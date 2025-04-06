import { Icon } from "@iconify/react";
import { Link } from "react-router";

export default function HomeHeader() {
  return (
    <header className="flex justify-between items-center w-full p-[1.1rem] bg-[var(--primary)] drop-shadow-xl z-10">
      <Link to="/">
        <Icon icon="mdi:home" className="text-gray-200 text-3xl" />
      </Link>
      <div className="text-gray-200 text-2xl font-bold">DSpark</div>
      <a href="#" title="menu">
        <Icon icon="mdi:menu" className="text-gray-200 text-3xl" />
      </a>
    </header>
  );
}
