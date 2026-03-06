import { formatBRL } from "@/src/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type TopExpenseItem = {
  id: string;
  title: string;
  category: string;
  value: number;
  date: Date;
};

type Props = {
  top5: TopExpenseItem[];
};

export function Top5ExpensesCard({ top5 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 despesas do mês</Text>

      {top5.length === 0 ? (
        <Text style={styles.empty}>Nenhuma despesa neste mês.</Text>
      ) : (
        <View style={styles.list}>
          {top5.map((x, idx) => {
            const isFirst = idx === 0;

            return (
              <View
                key={x.id}
                style={[styles.item, !isFirst && styles.itemBorder]}
              >
                <View style={styles.row}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {idx + 1}. {x.title}
                  </Text>

                  <Text style={styles.value}>{formatBRL(x.value)}</Text>
                </View>

                <Text style={styles.meta}>
                  {x.category} •{" "}
                  {x.date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#101828",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  empty: {
    fontSize: 13,
    color: "#667085",
  },
  list: {
    gap: 10,
    width: "100%",
  },
  item: {
    paddingVertical: 10,
    gap: 6,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#E6EEF0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    color: "#101828",
  },
  value: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FF5031",
  },
  meta: {
    fontSize: 12,
    color: "#667085",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
});
