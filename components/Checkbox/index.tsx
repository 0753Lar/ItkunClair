import React, { useState } from "react";

interface CheckboxProps {
  label?: string;
  onChange?: (val: boolean) => void;
}
const Checkbox = ({ label, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <label className="flex cursor-pointer items-center space-x-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="hidden"
      />
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
          isChecked ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
      >
        {isChecked && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
