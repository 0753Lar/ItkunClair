import React, { useState } from "react";

interface SwitchProps {
  isOn?: boolean;
  onToggle?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ isOn, onToggle }) => {
  const [on, toggle] = useState<boolean>(isOn ?? false);

  return (
    <button
      onClick={() => {
        toggle(!on);
        onToggle?.(!on);
      }}
      className={`relative inline-flex h-5 w-10 items-center shadow-inner shadow-slate-500/40 rounded-full outline-none transition-colors ${
        on ? "bg-red-500/70" : "bg-slate-200/20"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default Switch;
