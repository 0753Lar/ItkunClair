import React, { useState } from "react";

interface Option {
  label: string;
  value?: string;
}

interface CascaderProps {
  options: Option[];
  selectedLabel?: string;
  onSelect?: (val: string) => void;
}
const Cascader = ({ options, onSelect, selectedLabel }: CascaderProps) => {
  const [label, setLabel] = useState(selectedLabel || "Select Option");
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (option: Option) => {
    onSelect?.(option.value ?? option.label);
    setLabel(option.label);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block min-w-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full rounded-md border px-2 pr-4 md:hover:opacity-80"
      >
        {label}
        <span
          className={`absolute right-1 inline-block text-[10px] ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute w-full rounded-md border-[1px] border-slate-50 border-opacity-20 bg-slate-100/90 bg-clip-padding shadow-lg backdrop-blur-3xl backdrop-filter z-20">
          <div className="">
            {options.map((option) => (
              <div
                key={option.label}
                onClick={() => handleOptionSelect(option)}
                className="cursor-pointer px-1 text-center text-slate-700 md:hover:text-slate-500"
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cascader;
