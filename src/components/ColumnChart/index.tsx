import React, { useMemo } from "react";
import { Text, View, useWindowDimensions } from "react-native";

function toJSDate(raw: any): Date {
  if (!raw) return new Date(NaN);

  if (typeof raw === "object" && typeof raw.toDate === "function")
    return raw.toDate();
  if (typeof raw === "object" && typeof raw.seconds === "number")
    return new Date(raw.seconds * 1000);
  if (typeof raw === "object" && typeof raw._seconds === "number")
    return new Date(raw._seconds * 1000);

  return new Date(raw);
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);

  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const monthName = months[m - 1];
  const yearShort = String(y).slice(-2);

  return `${monthName}/${yearShort}`;
}

function lastNMonthKeys(n: number) {
  const now = new Date();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(monthKey(d));
  }
  return out;
}

type Tx = {
  type: "income" | "expense";
  value: number;
  date: any;
};

type MonthPoint = {
  key: string;
  label: string;
  income: number;
  expense: number;
};

function formatCompactBRL(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(".", ",")}k`;
  return String(Math.round(v));
}

export function ColumnChart({
  items,
  height = 180,
}: {
  items: Tx[];
  height?: number;
}) {
  const { width } = useWindowDimensions();

  const series: MonthPoint[] = useMemo(() => {
    const months = lastNMonthKeys(3);

    const byMonth = new Map<string, { income: number; expense: number }>();
    months.forEach((m) => byMonth.set(m, { income: 0, expense: 0 }));

    for (const t of items) {
      const d = toJSDate((t as any).date);
      if (Number.isNaN(d.getTime())) continue;

      const key = monthKey(d);
      if (!byMonth.has(key)) continue;

      const v = Number((t as any).value ?? 0);
      const slot = byMonth.get(key)!;

      if ((t as any).type === "income") slot.income += v;
      if ((t as any).type === "expense") slot.expense += v;
    }

    return months.map((m) => ({
      key: m,
      label: monthLabel(m),
      income: byMonth.get(m)!.income,
      expense: byMonth.get(m)!.expense,
    }));
  }, [items]);

  const maxValue = useMemo(() => {
    const max = Math.max(
      0,
      ...series.flatMap((m) =>
        [m.income, m.expense].map((x) => Number(x || 0)),
      ),
    );
    return max <= 0 ? 1 : max;
  }, [series]);

  const hasAnyValue = useMemo(() => {
    return series.some((m) => m.income > 0 || m.expense > 0);
  }, [series]);

  const chartWidth = width; // 100%
  const leftGutter = 44;
  const rightGutter = 10;

  const plotWidth = Math.max(0, chartWidth - leftGutter - rightGutter);

  const groupCount = 3;

  const MIN_BAR = 10;
  const MIN_INNER_GAP = 6;
  const MIN_GROUP_GAP = 14;

  let barWidth = 16;
  let innerGap = 10;
  let groupGap = 26;

  function totalNeeded(bw: number, ig: number, gg: number) {
    const groupW = bw * 2 + ig;
    return groupW * groupCount + gg * (groupCount - 1);
  }

  while (totalNeeded(barWidth, innerGap, groupGap) > plotWidth) {
    if (groupGap > MIN_GROUP_GAP) groupGap -= 2;
    else if (innerGap > MIN_INNER_GAP) innerGap -= 1;
    else if (barWidth > MIN_BAR) barWidth -= 1;
    else break;
  }

  const groupWidth = barWidth * 2 + innerGap;
  const total = totalNeeded(barWidth, innerGap, groupGap);

  const startX = total < plotWidth ? (plotWidth - total) / 2 : 0;

  function barH(v: number) {
    const h = Math.round((v / maxValue) * height);
    return Math.max(2, h);
  }

  const sections = 4;
  const yLabels = Array.from({ length: sections + 1 }, (_, i) => {
    const value = (maxValue * (sections - i)) / sections;
    return value;
  });

  if (!hasAnyValue) {
    return (
      <View>
        <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}>
          Receita x Despesa (últimos 3 meses)
        </Text>
        <Text style={{ opacity: 0.7 }}>Sem dados nos últimos 3 meses.</Text>
      </View>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}>
        Receita x Despesa (últimos 3 meses)
      </Text>

      <View style={{ width: "100%" }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: leftGutter,
              height,
              justifyContent: "space-between",
              paddingRight: 8,
            }}
          >
            {yLabels.map((v, idx) => (
              <Text
                key={idx}
                style={{ fontSize: 11, opacity: 0.65, textAlign: "right" }}
              >
                {formatCompactBRL(v)}
              </Text>
            ))}
          </View>

          <View style={{ flex: 1, paddingRight: rightGutter }}>
            <View style={{ height, position: "relative" }}>
              {/* Grid */}
              {Array.from({ length: sections + 1 }, (_, i) => (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: Math.round((height * i) / sections),
                    height: 1,
                    backgroundColor: "#E5E7EB",
                    opacity: i === sections ? 1 : 0.8,
                  }}
                />
              ))}

              <View
                style={{
                  position: "absolute",
                  left: startX,
                  bottom: 0,
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                {series.map((m, idx) => {
                  const incomeH = barH(m.income);
                  const expenseH = barH(m.expense);

                  return (
                    <View
                      key={m.key}
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        marginRight: idx === series.length - 1 ? 0 : groupGap,
                      }}
                    >
                      <View
                        style={{
                          width: barWidth,
                          height: incomeH,
                          backgroundColor: "#16A34A",
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                        }}
                      />

                      <View style={{ width: innerGap }} />

                      <View
                        style={{
                          width: barWidth,
                          height: expenseH,
                          backgroundColor: "#DC2626",
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                paddingLeft: startX,
              }}
            >
              {series.map((m, idx) => (
                <View
                  key={m.key}
                  style={{
                    width: groupWidth,
                    marginRight: idx === series.length - 1 ? 0 : groupGap,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "600" }}>
                    {m.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 12, flexDirection: "row", gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: "#16A34A",
                borderRadius: 2,
              }}
            />
            <Text>Receita</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: "#DC2626",
                borderRadius: 2,
              }}
            />
            <Text>Despesa</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
