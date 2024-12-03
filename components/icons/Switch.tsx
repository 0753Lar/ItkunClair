import React from "react";

interface SwitchProps {
  isOn?: boolean;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ isOn, onToggle, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        onToggle?.(!isOn);
      }}
      className={`relative inline-flex h-5 w-10 items-center rounded-full shadow-inner shadow-slate-500/40 outline-none transition-colors ${
        isOn ? "bg-red-500/70" : "bg-slate-200/20"
      } `}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          isOn ? "translate-x-5" : "translate-x-0"
        } ${disabled ? "bg-slate-100/20" : ""}`}
      />
    </button>
  );
};

export default Switch;
