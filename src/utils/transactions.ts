import { monthKey, toJSDate } from "./date";

type AnyTx = any;

export function getMonthSummary(items: AnyTx[], currentMonth: string) {
  const monthItems = items.filter((t) => {
    const d = toJSDate(t?.date);
    if (Number.isNaN(d.getTime())) return false;
    return monthKey(d) === currentMonth;
  });

  let income = 0;
  let expense = 0;

  for (const t of monthItems) {
    const value = Number(t?.value ?? 0);
    if (t?.type === "income") income += value;
    else if (t?.type === "expense") expense += value;
  }

  const balance = income - expense;

  const top5 = monthItems
    .filter((t) => t?.type === "expense")
    .map((t) => ({
      id: String(t?.id ?? ""),
      title: String(t?.title ?? "Sem título"),
      category: String(t?.category ?? "Sem categoria"),
      value: Number(t?.value ?? 0),
      date: toJSDate(t?.date),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return { income, expense, balance, top5 };
}
