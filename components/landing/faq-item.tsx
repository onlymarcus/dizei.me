type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="glass-card group p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-slate-950">
        {question}
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-4 max-w-3xl pr-8 text-sm leading-7 text-slate-600">
        {answer}
      </p>
    </details>
  );
}
