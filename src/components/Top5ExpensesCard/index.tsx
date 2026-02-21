import React from "react";
import { Text, View } from "react-native";

export type TopExpenseItem = {
  id: string;
  title: string;
  category: string;
  value: number;
  date: Date;
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  top5: TopExpenseItem[];
};

export function Top5ExpensesCard({ top5 }: Props) {
  return (
    <View style={{ padding: 12, borderWidth: 1, borderRadius: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}>
        Top 5 gastos do mês
      </Text>

      {top5.length === 0 ? (
        <Text>Nenhuma despesa neste mês.</Text>
      ) : (
        <View style={{ gap: 10 }}>
          {top5.map((x, idx) => (
            <View
              key={x.id}
              style={{
                paddingVertical: 10,
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: "#E5E7EB",
                gap: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <Text style={{ fontWeight: "800", flex: 1 }} numberOfLines={1}>
                  {idx + 1}. {x.title}
                </Text>
                <Text style={{ fontWeight: "900" }}>{formatBRL(x.value)}</Text>
              </View>

              <Text style={{ opacity: 0.7 }}>
                {x.category} •{" "}
                {x.date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
