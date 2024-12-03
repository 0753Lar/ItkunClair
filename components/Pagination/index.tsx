import ToLeft from "../icons/ToLeft";
import ToRight from "../icons/ToRight";

interface PaginationProps {
  current: number;
  total?: number;
  onChange?: (val: number) => void;
}
export default function Pagination({
  current,
  total,
  onChange,
}: PaginationProps) {
  const max = total ?? 20;

  const onLeftClick = () => {
    const newVal = Math.max(0, current - 1);
    onChange?.(newVal);
  };

  const onRightClick = () => {
    const newVal = Math.min(max - 1, current + 1);
    onChange?.(newVal);
    return;
  };

  return (
    <div className="flex items-center">
      <span
        className="h-4 md:hover:cursor-pointer md:hover:text-slate-200/80"
        onClick={onLeftClick}
      >
        <ToLeft />
      </span>
      <span className="text-sm md:text-base">
        {current + 1}/{max ?? 20}
      </span>
      <span
        className="h-4 md:hover:cursor-pointer md:hover:text-slate-200/80"
        onClick={onRightClick}
      >
        <ToRight />
      </span>
    </div>
  );
}
