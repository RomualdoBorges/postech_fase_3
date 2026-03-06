import React, { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

/* ----------------------------------------------------------------------------
 * Utils (mantidos aqui, mas você pode mover para utils/ depois)
 * -------------------------------------------------------------------------- */

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

/* ----------------------------------------------------------------------------
 * Component
 * -------------------------------------------------------------------------- */

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

  /* ----------------------------------------------------------------------------
   * Layout / sizing (mesma lógica)
   * -------------------------------------------------------------------------- */

  const chartWidth = width; // 100%
  const leftGutter = 46;
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

  /* ----------------------------------------------------------------------------
   * Empty state
   * -------------------------------------------------------------------------- */

  if (!hasAnyValue) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Receita x Despesa</Text>
        <Text style={styles.subtitle}>Últimos 3 meses</Text>

        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Sem dados nos últimos 3 meses.</Text>
        </View>
      </View>
    );
  }

  /* ----------------------------------------------------------------------------
   * Render
   * -------------------------------------------------------------------------- */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receita x Despesa</Text>
      <Text style={styles.subtitle}>Últimos 3 meses</Text>

      <View>
        <View style={styles.row}>
          {/* Y axis labels */}
          <View style={[styles.yAxis, { width: leftGutter, height }]}>
            {yLabels.map((v, idx) => (
              <Text key={idx} style={styles.yAxisText}>
                {formatCompactBRL(v)}
              </Text>
            ))}
          </View>

          {/* Plot */}
          <View style={[styles.plotWrap, { paddingRight: rightGutter }]}>
            <View style={[styles.plotArea, { height }]}>
              {/* Grid lines */}
              {Array.from({ length: sections + 1 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.gridLine,
                    { top: Math.round((height * i) / sections) },
                    i === sections && styles.gridLineBottom,
                  ]}
                />
              ))}

              {/* Bars */}
              <View style={[styles.barsRow, { left: startX }]}>
                {series.map((m, idx) => {
                  const incomeH = barH(m.income);
                  const expenseH = barH(m.expense);

                  return (
                    <View
                      key={m.key}
                      style={[
                        styles.group,
                        {
                          marginRight: idx === series.length - 1 ? 0 : groupGap,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.bar,
                          styles.incomeBar,
                          {
                            width: barWidth,
                            height: incomeH,
                          },
                        ]}
                      />

                      <View style={{ width: innerGap }} />

                      <View
                        style={[
                          styles.bar,
                          styles.expenseBar,
                          {
                            width: barWidth,
                            height: expenseH,
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* X labels */}
            <View style={[styles.xLabelsRow, { paddingLeft: startX }]}>
              {series.map((m, idx) => (
                <View
                  key={m.key}
                  style={[
                    styles.xLabelBox,
                    {
                      width: groupWidth,
                      marginRight: idx === series.length - 1 ? 0 : groupGap,
                    },
                  ]}
                >
                  <Text style={styles.xLabelText}>{m.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <LegendItem label="Receita" color="#004D61" />
          <LegendItem label="Despesa" color="#FF5031" />
        </View>
      </View>
    </View>
  );
}

/* ----------------------------------------------------------------------------
 * Legend
 * -------------------------------------------------------------------------- */

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

/* ----------------------------------------------------------------------------
 * Styles
 * -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#101828",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#667085",
    textTransform: "uppercase",
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
  yAxis: {
    justifyContent: "space-between",
    paddingRight: 8,
  },
  yAxisText: {
    fontSize: 11,
    color: "#667085",
    textAlign: "right",
    fontWeight: "600",
  },
  plotWrap: {
    flex: 1,
  },
  plotArea: {
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#DEE9EA",
    opacity: 0.85,
  },
  gridLineBottom: {
    opacity: 1,
  },
  barsRow: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  group: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  incomeBar: {
    backgroundColor: "#004D61",
  },
  expenseBar: {
    backgroundColor: "#FF5031",
  },
  xLabelsRow: {
    marginTop: 10,
    flexDirection: "row",
  },
  xLabelBox: {
    alignItems: "center",
  },
  xLabelText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#344054",
  },
  legendRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 14,
    justifyContent: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#DEE9EA",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#344054",
  },
  emptyBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DEE9EA",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },
  emptyText: {
    color: "#667085",
    fontWeight: "600",
  },
});
