export function toJSDate(raw: any): Date {
  if (!raw) return new Date(NaN);

  if (typeof raw === "object" && typeof raw.toDate === "function") {
    return raw.toDate();
  }

  if (typeof raw === "object" && typeof raw.seconds === "number") {
    return new Date(raw.seconds * 1000);
  }
  if (typeof raw === "object" && typeof raw._seconds === "number") {
    return new Date(raw._seconds * 1000);
  }

  return new Date(raw);
}

export function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}
