import { Transaction, TransactionsSummary } from "../types/transactions";

export function getTransactionsSummary(items: Transaction[]): TransactionsSummary {
    const income = items
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + (t.value ?? 0), 0);

    const expense = items
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + (t.value ?? 0), 0);

    const balance = income - expense;

    const byCategoryMap = new Map<string, number>();
    for (const t of items) {
        const key = t.category ?? "Sem categoria";
        byCategoryMap.set(key, (byCategoryMap.get(key) ?? 0) + (t.value ?? 0));
    }

    const byCategory = Array.from(byCategoryMap.entries())
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6);

    return { income, expense, balance, byCategory };
}