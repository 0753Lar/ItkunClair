import { useQuizContext } from "@/app/context/quizContext";
import { useLocale } from "@/hooks/useLocale";

export default function Congratulation({
  onNext,
  onRetry,
}: {
  onNext?: () => void;
  onRetry?: () => void;
}) {
  const { quizcount } = useQuizContext();
  const t = useLocale();
  return (
    <div className="card">
      <div className="my-4 flex flex-col gap-2 text-center">
        <div className="flex flex-col items-center">
          <div>{t("home_guess_word_congratulation_title")}</div>
          <p className="text-sm text-slate-200">
            You finished a round of {quizcount} quiz!
          </p>
          <p className="text-sm text-slate-200">
            Click on below button to start a new round.
          </p>
        </div>
        <div>
          <button className="rounded-md border p-1 text-sm" onClick={onRetry}>
            Try again
          </button>
        </div>
        <div>
          <button className="rounded-md border p-1 text-sm" onClick={onNext}>
            Continue Next Round
          </button>
        </div>
      </div>
    </div>
  );
}
