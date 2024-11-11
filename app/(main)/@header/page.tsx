"use client";

import Github from "@/components/Github";
import Toggle from "@/components/Toggle";
import pkg from "@/package.json";

export default function Header() {
  return (
    <header>
      <div className="flex flex-row justify-end py-4 mr-8 md:mr-4">
        <div className="badge-bar">
          <Github />
          <Toggle />
        </div>
      </div>

      <div className="relative text-center">
        <div className="text-6xl text-white">{pkg.name}</div>
        <div className="glass-header absolute  left-1/2 top-0"></div>
      </div>
    </header>
  );
}
