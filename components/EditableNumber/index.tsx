import React, { ChangeEventHandler, useState } from "react";

interface EditableNumberProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onSave?: (val: number) => void;
  onChange?: (val: number) => void;
}
const EditableNumber = ({
  initialValue,
  min = 0,
  max = 100,
  onSave,
  onChange,
}: EditableNumberProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || 0);

  const handleDecrease = () => {
    if (value > min) {
      setValue(value - 1);
      onSave?.(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      setValue(value + 1);
      onSave?.(value + 1);
    }
  };

  const handleSave = () => {
    if (value > max) {
      onChange?.(max);
      setValue(max);
      return;
    } else if (value < min) {
      onChange?.(min);
      setValue(min);
      return;
    }

    setIsEditing(false);
    onSave?.(value);
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.value.match(/^\d*$/)) {
      return;
    }

    onChange?.(Number(e.target.value));
    setValue(Number(e.target.value));
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrease}
        className="px-2 font-bold md:text-lg md:hover:opacity-80"
      >
        &lt;
      </button>

      <div className="flex w-10 items-center justify-center text-base">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={onInputChange}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full border-gray-300 bg-transparent text-center outline-none"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="w-full cursor-pointer text-center font-semibold md:hover:opacity-80"
          >
            {value}
          </span>
        )}
      </div>

      <button
        onClick={handleIncrease}
        className="px-2 font-bold md:text-lg md:hover:opacity-80"
      >
        &gt;
      </button>
    </div>
  );
};

export default EditableNumber;
