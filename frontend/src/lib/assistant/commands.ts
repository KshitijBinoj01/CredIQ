import { computeFactorScores, countAccountTypes, FACTOR_LABELS } from "@/lib/factorEngine";
import { formatMoney, type Currency } from "@/lib/currency";
import {
  applyWhatIf,
  WHAT_IF_IDS,
  type WhatIfId,
} from "@/lib/whatIfPatches";
import type { IntakeAnswers } from "@/types/intake";
import type { FactorKey, ScoreBreakdown } from "@/types/score";

export interface AssistantResult {
  reply: string;
  reset?: boolean;
}

export const FAQ_ITEMS: Array<{ title: string; body: string }> = [
  {
    title: "Is this a real FICO score?",
    body: "No. CreditIQ’s borrower gauge is a transparent FICO-style estimate: 300 plus up to 550 points from five factors. It is not a bureau FICO, VantageScore, or Equifax/Experian/TransUnion pull.",
  },
  {
    title: "How are the five factors weighted?",
    body: "Payment history 35%, credit utilization 30%, credit age 15%, credit mix 10%, new credit 10%. Those weights follow common FICO education charts.",
  },
  {
    title: "Does income change the borrower score?",
    body: "Annual income is stored for context and the lender model, but classic FICO-style scoring does not use income. The gauge ignores it.",
  },
  {
    title: "How do USD and INR work?",
    body: "Money is stored in USD. The navbar toggle shows rupees at 1 USD = 96 INR. The 300–850 score never converts.",
  },
  {
    title: "Borrower vs lender?",
    body: "Borrower view uses the five-factor estimate from your questionnaire. Lender view uses a Kaggle default-risk model (probability of serious delinquency in two years), not FICO points.",
  },
  {
    title: "What data is used?",
    body: "Lender training uses Kaggle Give Me Some Credit in USD. Your intake stays in the browser session unless you call the API. This is a hackathon demo, not a credit bureau.",
  },
];

export const COMMAND_HELP = `Available commands:
/help — list commands
/faq — scoring FAQ
/how — how THIS score was built
/factors — five bars with points
/why — weakest factor and why
/improve — top actions with estimated point lift
/whatif payoff|miss|wait|open|close|max — narrate a scenario
/inr /usd — currency rules
/intake — recap of your answers
/lender — how portfolio ML differs
/disclaimer — not a bureau score
/reset — clear this chat`;

export const COMMAND_CHIPS = [
  "/faq",
  "/how",
  "/factors",
  "/why",
  "/improve",
  "/whatif payoff",
  "/help",
] as const;

export function parseAssistantCommand(
  raw: string,
): { name: string; args: string[] } | null {
  const text = raw.trim();
  if (!text.startsWith("/")) return null;
  const parts = text.split(/\s+/);
  let name = parts[0].toLowerCase().replace(/^\//, "");
  if (name === "what-if" || name === "what_if") name = "whatif";
  return { name, args: parts.slice(1) };
}

function factorsTable(breakdown: ScoreBreakdown): string {
  const lines = [
    `Score ${breakdown.score} (${breakdown.bandLabel}). 300 + five factors (max 550):`,
  ];
  for (const factor of breakdown.factors) {
    lines.push(
      `• ${factor.label}: ${factor.points}/${Math.round(factor.maxPoints)} pts (${factor.percentOfMax}% of max, ${Math.round(factor.weight * 100)}%). ${factor.summary}`,
    );
  }
  return lines.join("\n");
}

function how(breakdown: ScoreBreakdown): string {
  return `Your ${breakdown.score} (${breakdown.bandLabel}) is 300 plus points from five factors: payment 35%, utilization 30%, age 15%, mix 10%, new credit 10%. ${breakdown.insight}`;
}

function why(breakdown: ScoreBreakdown): string {
  const weakest = [...breakdown.factors].sort(
    (a, b) => a.percentOfMax - b.percentOfMax,
  )[0];
  return `The weakest factor is ${weakest.label} (${weakest.percentOfMax}% of its max, ${weakest.points}/${Math.round(weakest.maxPoints)} pts). ${weakest.summary} ${breakdown.insight}`;
}

function intakeRecap(intake: IntakeAnswers, currency: Currency): string {
  const types = countAccountTypes(intake);
  const util =
    intake.totalCreditLimit > 0
      ? Math.round((intake.totalCreditBalance / intake.totalCreditLimit) * 100)
      : 0;
  return `History: ${intake.yearsSinceFirstCredit} years (${intake.hasCreditSixMonths ? "6+ months on file" : "thin file"}). ${types} account type(s). ${intake.creditApplicationsLastYear} application(s) last year. Last miss: ${intake.lastMissedPayment}. Limit ${formatMoney(intake.totalCreditLimit, currency)}, balance ${formatMoney(intake.totalCreditBalance, currency)} (${util}% util). Income ${formatMoney(intake.annualIncome, currency)} (display only). Negative events: ${intake.hasNegativeEvents ? `yes, ${intake.negativeEventRecency}` : "none"}.`;
}

function improve(intake: IntakeAnswers, breakdown: ScoreBreakdown): string {
  const baseline = breakdown.score;
  const ideas: Array<{ delta: number; text: string }> = [];

  const consider = (label: string, patched: IntakeAnswers) => {
    const delta = computeFactorScores(patched).score - baseline;
    if (delta > 0) {
      ideas.push({
        delta,
        text: `${label}: about +${delta} points (to ${baseline + delta}).`,
      });
    }
  };

  consider("Pay revolving balance to $0", applyWhatIf("payoff", intake));
  consider("Wait 1 year (age + no new inquiries)", applyWhatIf("wait", intake));
  consider("Pause new applications this year", {
    ...intake,
    creditApplicationsLastYear: 0,
  });
  if (intake.lastMissedPayment !== "never") {
    consider("Bring payments current (no recent miss)", {
      ...intake,
      lastMissedPayment: "never",
    });
  }
  if (countAccountTypes(intake) < 3) {
    consider("Add a responsible installment account over time", {
      ...intake,
      accountTypes: { ...intake.accountTypes, autoLoan: true },
    });
  }

  ideas.sort((a, b) => b.delta - a.delta);
  const top = ideas.slice(0, 3);
  if (top.length === 0) {
    return "This profile is already using most of its factor headroom. Keep on-time payments and utilization under 30%.";
  }
  return [
    "Highest-lift actions from your current answers (estimate only):",
    ...top.map((item, index) => `${index + 1}. ${item.text}`),
  ].join("\n");
}

function faq(args: string[]): string {
  if (args.length === 0) {
    return FAQ_ITEMS.map(
      (item, index) => `${index + 1}. ${item.title}\n${item.body}`,
    ).join("\n\n");
  }
  const needle = args.join(" ").toLowerCase();
  const match = FAQ_ITEMS.find(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.body.toLowerCase().includes(needle),
  );
  return match ? `${match.title}\n${match.body}` : faq([]);
}

function whatif(
  args: string[],
  intake: IntakeAnswers,
  breakdown: ScoreBreakdown,
): string {
  if (args.length === 0) {
    return "Use /whatif payoff, miss, wait, open, close, or max.";
  }
  const scenario = args[0].toLowerCase() as WhatIfId;
  if (!WHAT_IF_IDS.includes(scenario)) {
    return "Unknown scenario. Try payoff, miss, wait, open, close, or max.";
  }
  const after = computeFactorScores(applyWhatIf(scenario, intake));
  const delta = after.score - breakdown.score;
  const sign = delta >= 0 ? `+${delta}` : `${delta}`;
  return `What-if ${scenario}: score ${breakdown.score} → ${after.score} (${sign}). ${after.insight}`;
}

export function runAssistantCommand(
  name: string,
  args: string[],
  intake: IntakeAnswers,
  currency: Currency,
  breakdown: ScoreBreakdown,
): AssistantResult {
  switch (name) {
    case "reset":
      return { reply: "Chat cleared. Ask anything or type /help.", reset: true };
    case "help":
    case "commands":
      return { reply: COMMAND_HELP };
    case "faq":
      return { reply: faq(args) };
    case "how":
      return { reply: how(breakdown) };
    case "factors":
    case "factor":
      return { reply: factorsTable(breakdown) };
    case "why":
      return { reply: why(breakdown) };
    case "improve":
      return { reply: improve(intake, breakdown) };
    case "whatif":
      return { reply: whatif(args, intake, breakdown) };
    case "inr":
    case "rupee":
    case "rupees":
      return {
        reply:
          "Toggle USD / INR in the navbar. Income, limits, and balances convert at 1 USD = 96 INR. The 300–850 score does not change.",
      };
    case "usd":
      return {
        reply:
          "USD is canonical. The INR toggle only changes display (×96). Scoring math always uses dollars.",
      };
    case "intake":
      return { reply: intakeRecap(intake, currency) };
    case "lender":
      return {
        reply:
          "Lender scores default risk from Kaggle Give Me Some Credit (serious delinquency in 2 years). Those SHAP groups are lates, utilization, income, and leverage — not the five FICO-style bars on the borrower gauge.",
      };
    case "disclaimer":
      return {
        reply:
          "CreditIQ is a hackathon demo. The borrower number is an educational FICO-style estimate, not a bureau score, not credit advice, and not a promise of approval.",
      };
    default:
      return { reply: `Unknown command /${name}.\n${COMMAND_HELP}` };
  }
}

export function fallbackFreeText(
  question: string,
  breakdown: ScoreBreakdown,
  intake: IntakeAnswers,
  currency: Currency,
): string {
  const q = question.toLowerCase();
  if (q.includes("inr") || q.includes("rupee") || q.includes("dollar") || q.includes("usd")) {
    return runAssistantCommand("inr", [], intake, currency, breakdown).reply;
  }
  if (q.includes("faq")) {
    return runAssistantCommand("faq", [], intake, currency, breakdown).reply;
  }
  if (q.includes("lender") || q.includes("kaggle")) {
    return runAssistantCommand("lender", [], intake, currency, breakdown).reply;
  }
  if (q.includes("util")) {
    const factor = breakdown.factors.find((item) => item.key === "utilization");
    return factor
      ? `${factor.summary} This factor is worth up to ${Math.round(factor.maxPoints)} points.`
      : "";
  }
  if (q.includes("payment") || q.includes("miss")) {
    return (
      breakdown.factors.find((item) => item.key === "paymentHistory")?.summary ??
      ""
    );
  }
  if (q.includes("thin") || q.includes("age")) {
    return (
      breakdown.factors.find((item) => item.key === "creditAge")?.summary ?? ""
    );
  }
  if (q.includes("mix")) {
    return (
      breakdown.factors.find((item) => item.key === "creditMix")?.summary ?? ""
    );
  }
  if (q.includes("inquir") || q.includes("new credit") || q.includes("apply")) {
    return (
      breakdown.factors.find((item) => item.key === "newCredit")?.summary ?? ""
    );
  }
  if (q.includes("improve") || q.includes("lift")) {
    return runAssistantCommand("improve", [], intake, currency, breakdown).reply;
  }
  if (q.includes("why") || q.includes("low")) {
    return runAssistantCommand("why", [], intake, currency, breakdown).reply;
  }
  if (q.includes("how") && (q.includes("work") || q.includes("score"))) {
    return runAssistantCommand("how", [], intake, currency, breakdown).reply;
  }
  return `${breakdown.insight} Try /faq, /why, /improve, or /help.`;
}

export function runAssistantMessage(
  text: string,
  breakdown: ScoreBreakdown,
  intake: IntakeAnswers,
  currency: Currency,
): AssistantResult {
  const parsed = parseAssistantCommand(text);
  if (!parsed) {
    return { reply: fallbackFreeText(text, breakdown, intake, currency) };
  }
  return runAssistantCommand(
    parsed.name,
    parsed.args,
    intake,
    currency,
    breakdown,
  );
}

export function factorLabel(key: FactorKey): string {
  return FACTOR_LABELS[key];
}
