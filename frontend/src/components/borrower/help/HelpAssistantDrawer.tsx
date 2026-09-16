import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { Surface } from "@/components/ui/surface";
import { chatAssistant } from "@/api/assistant";
import {
  COMMAND_CHIPS,
  runAssistantMessage,
} from "@/lib/assistant/commands";
import { useCurrency } from "@/context/CurrencyContext";
import type { IntakeAnswers } from "@/types/intake";
import type { ScoreBreakdown } from "@/types/score";

interface HelpAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  intake: IntakeAnswers;
}

interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export function HelpAssistantDrawer({
  open,
  onClose,
  breakdown,
  intake,
}: HelpAssistantDrawerProps) {
  const { currency } = useCurrency();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [pending, setPending] = useState(false);

  const starter = `Your current estimate is ${breakdown.score} (${breakdown.bandLabel}). Use /faq, /why, /improve, or ask in plain language.`;

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setQuestion("");
    const local = runAssistantMessage(trimmed, breakdown, intake, currency);
    if (local.reset) {
      setMessages([]);
      return;
    }
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    if (trimmed.startsWith("/")) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: local.reply },
      ]);
      return;
    }
    setPending(true);
    try {
      const history = [
        ...messages.map((item) => ({ role: item.role, content: item.text })),
        { role: "user" as const, content: trimmed },
      ];
      const remote = await chatAssistant({
        messages: history,
        intake,
        currency,
      });
      setMessages((current) => [
        ...current,
        { role: "assistant", text: remote.reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: local.reply },
      ]);
    } finally {
      setPending(false);
    }
  }

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
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
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

            <p className="mt-4 px-6 text-sm text-muted-foreground">{starter}</p>

            <div className="mt-4 flex flex-wrap gap-2 px-6">
              {COMMAND_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void submit(chip)}
                  className="rounded-full bg-surface-raised px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-4">
              {messages.length === 0 ? (
                <Surface className="rounded-2xl px-4 py-4" variant="inset">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {runAssistantMessage("/faq", breakdown, intake, currency).reply}
                  </p>
                </Surface>
              ) : (
                messages.map((item, index) => (
                  <Surface
                    key={`${item.role}-${index}`}
                    className="rounded-2xl px-4 py-4"
                    variant={item.role === "user" ? "elevated" : "inset"}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {item.role === "user" ? "You" : "CreditIQ"}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {item.text}
                    </p>
                  </Surface>
                ))
              )}
              {pending ? (
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Thinking…
                </p>
              ) : null}
            </div>

            <form
              className="border-t border-white/5 px-6 py-4"
              onSubmit={(event) => {
                event.preventDefault();
                void submit(question);
              }}
            >
              <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Ask for help
              </label>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="/faq  or  Why is my score low?"
                className="mt-2 w-full rounded-xl bg-surface-inset px-4 py-3 text-sm outline-none ring-1 ring-white/5 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black"
              >
                Ask
              </button>
            </form>
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
