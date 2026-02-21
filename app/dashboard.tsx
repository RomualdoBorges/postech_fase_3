import { ColumnChart } from "@/src/components/ColumnChart";
import { Top5ExpensesCard } from "@/src/components/Top5ExpensesCard";
import { useAuth } from "@/src/context/AuthContext";
import { useTransactions } from "@/src/context/TransactionsContext";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  ScrollView,
  Text,
  View,
} from "react-native";

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

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

export default function DashboardScreen() {
  const { items, loading, loadFirstPage } = useTransactions();
  const { logout } = useAuth();

  const scrollRef = useRef<ScrollView>(null);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      fade.setValue(0);
      slide.setValue(20);
      chartAnim.setValue(0);

      loadFirstPage();

      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        fade.stopAnimation();
        slide.stopAnimation();
        chartAnim.stopAnimation();
      };
    }, [fade, slide, chartAnim, loadFirstPage]),
  );

  useEffect(() => {
    if (loading) return;

    chartAnim.setValue(0);
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [loading, items.length, chartAnim]);

  const currentMonth = useMemo(() => monthKey(new Date()), []);

  const monthData = useMemo(() => {
    const monthItems = items.filter((t) => {
      const d = toJSDate((t as any).date);
      if (Number.isNaN(d.getTime())) return false;
      return monthKey(d) === currentMonth;
    });

    let income = 0;
    let expense = 0;

    for (const t of monthItems) {
      const value = Number((t as any).value ?? 0);
      if ((t as any).type === "income") income += value;
      else if ((t as any).type === "expense") expense += value;
    }

    const balance = income - expense;

    const top5 = monthItems
      .filter((t) => (t as any).type === "expense")
      .map((t) => ({
        id: String((t as any).id ?? ""),
        title: String((t as any).title ?? "Sem título"),
        category: String((t as any).category ?? "Sem categoria"),
        value: Number((t as any).value ?? 0),
        date: toJSDate((t as any).date),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { income, expense, balance, top5 };
  }, [items, currentMonth]);

  if (loading && items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando...</Text>
      </View>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "800" }}>Dashboard</Text>
        <Text style={{ marginTop: 8, textAlign: "center", opacity: 0.75 }}>
          Você ainda não tem transações cadastradas.
        </Text>

        <View style={{ marginTop: 18, width: "100%" }}>
          <Button
            title="Criar primeira transação"
            onPress={() => router.navigate("/transactions")}
          />
        </View>
      </View>
    );
  }

  const chartsAnimatedStyle = {
    opacity: chartAnim,
    transform: [
      {
        scale: chartAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fade,
        transform: [{ translateY: slide }],
      }}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "800" }}>Dashboard</Text>
        <Text style={{ marginTop: 4, opacity: 0.7 }}>
          Resumo de {monthLabel(currentMonth)}
        </Text>

        <View style={{ marginTop: 14, gap: 10 }}>
          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontWeight: "700" }}>Receitas</Text>
            <Text style={{ fontSize: 18 }}>{formatBRL(monthData.income)}</Text>
          </View>

          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontWeight: "700" }}>Despesas</Text>
            <Text style={{ fontSize: 18 }}>{formatBRL(monthData.expense)}</Text>
          </View>

          <View style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontWeight: "700" }}>Saldo</Text>
            <Text style={{ fontSize: 18 }}>{formatBRL(monthData.balance)}</Text>
          </View>
        </View>

        <Animated.View
          style={[
            {
              marginTop: 18,
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
            },
            chartsAnimatedStyle,
          ]}
        >
          <ColumnChart items={items as any} />
        </Animated.View>

        <Animated.View style={[{ marginTop: 18 }, chartsAnimatedStyle]}>
          <Top5ExpensesCard top5={monthData.top5} />
        </Animated.View>

        <View style={{ marginTop: 18, gap: 18 }}>
          <Button
            title="Ver Transações"
            onPress={() => router.navigate("/transactions")}
          />

          <Button
            title="Sair"
            onPress={async () => {
              try {
                await logout();
                // router.replace("/"); // ou "/login" se existir
              } catch (e: any) {
                Alert.alert("Erro", e?.message ?? "Falha ao sair");
              }
            }}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}
