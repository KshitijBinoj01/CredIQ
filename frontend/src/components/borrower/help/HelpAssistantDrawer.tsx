import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { Surface } from "@/components/ui/surface";
import { answerHelpQuestion, tipsForBreakdown } from "@/lib/tipEngine";
import type { IntakeAnswers } from "@/types/intake";
import type { ScoreBreakdown } from "@/types/score";

interface HelpAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  intake: IntakeAnswers;
}

export function HelpAssistantDrawer({
  open,
  onClose,
  breakdown,
  intake,
}: HelpAssistantDrawerProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const tips = tipsForBreakdown(breakdown);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close help"
            className="fixed inset-0 z-40 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-background px-6 py-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                  ( assistant )
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  How this score works
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-surface-raised p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Your current estimate is {breakdown.score} ({breakdown.bandLabel}).
              Ask a question or read the factor guide below.
            </p>

            <form
              className="mt-6"
              onSubmit={(event) => {
                event.preventDefault();
                setAnswer(answerHelpQuestion(question, breakdown, intake));
              }}
            >
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Ask for help
              </label>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Why is my score low? How does INR work?"
                className="mt-2 w-full rounded-xl bg-surface-inset px-4 py-3 text-sm outline-none ring-1 ring-white/5 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black"
              >
                Ask
              </button>
            </form>

            {answer ? (
              <Surface className="mt-4 rounded-2xl px-4 py-4" variant="inset">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {answer}
                </p>
              </Surface>
            ) : null}

            <div className="mt-8 space-y-4">
              {tips.map((tip) => (
                <Surface key={tip.title} className="rounded-2xl px-4 py-4" variant="inset">
                  <p className="text-sm font-semibold">{tip.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tip.body}
                  </p>
                </Surface>
              ))}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function HelpAssistantButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <HelpCircle className="size-3.5" />
      Help
    </button>
  );
}
