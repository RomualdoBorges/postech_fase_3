import React from "react";
import { StyleSheet, View } from "react-native";
import { SummaryCard } from "../SummaryCard";

type Props = {
  income: number;
  expense: number;
  balance: number;
  formatValue: (v: number) => string;
};

export function SummaryCards({ income, expense, balance, formatValue }: Props) {
  const balanceColor = balance >= 0 ? "#004D61" : "#FF5031";

  return (
    <View style={styles.grid}>
      <SummaryCard
        title="Receitas"
        value={formatValue(income)}
        badgeColor="#004D61"
      />

      <SummaryCard
        title="Despesas"
        value={formatValue(expense)}
        badgeColor="#FF5031"
      />

      <SummaryCard
        title="Saldo"
        value={formatValue(balance)}
        badgeColor={balanceColor}
        valueColor={balanceColor}
        subtitle={balance >= 0 ? "positivo" : "negativo"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 14,
    gap: 10,
  },
});
