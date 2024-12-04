import React, { useEffect, useState } from "react";

interface Option {
  label: string;
  value?: string;
}

interface OptionProps {
  options: Option[];
  selectedLabel?: string;
  onSelect?: (val: string) => void;
}
const Option = ({ options, onSelect, selectedLabel }: OptionProps) => {
  const [label, setLabel] = useState("Select Option");
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (option: Option) => {
    onSelect?.(option.value ?? option.label);
    setLabel(option.label);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selectedLabel) {
      setLabel(selectedLabel);
    }
  }, [selectedLabel]);

  return (
    <div className="relative inline-block min-w-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full rounded-md border-[1px] border-slate-300/80 px-2 pr-5 md:hover:opacity-80"
      >
        {label}
        <span
          className={`absolute right-1 top-1/2 inline-block -translate-y-1/2 text-xs ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full overflow-hidden rounded-md border-[1px] border-slate-50 border-opacity-20 bg-clip-padding shadow-lg backdrop-blur-3xl backdrop-filter">
          <div>
            {options.map((option) => (
              <div
                key={option.label}
                onClick={() => handleOptionSelect(option)}
                className={`cursor-pointer px-1 text-center text-slate-700 md:hover:text-slate-500 ${option.label === label ? "bg-slate-200" : "bg-slate-100"} md:hover:bg-slate-200/90`}
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

export default Option;
