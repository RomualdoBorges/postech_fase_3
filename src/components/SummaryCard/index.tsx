import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  value: string;
  badgeColor: string;
  valueColor?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function SummaryCard({
  title,
  value,
  badgeColor,
  valueColor = "#0F172A",
  subtitle,
  children,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: badgeColor }]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>

        {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}

        <Text style={[styles.cardValue, { color: valueColor }]}>{value}</Text>

        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DEE9EA",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  badge: {
    width: 6,
    borderRadius: 999,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#101828",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#667085",
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  cardValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});
