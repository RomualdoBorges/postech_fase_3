import ActionButton from "@/src/components/ActionButton";
import { ColumnChart } from "@/src/components/ColumnChart";
import { DashboardHeader } from "@/src/components/DashboardHeader";
import { EmptyTransactionsState } from "@/src/components/EmptyTransactionsState";
import { SummaryCards } from "@/src/components/SummaryCards";
import { Top5ExpensesCard } from "@/src/components/Top5ExpensesCard";
import { useAuth } from "@/src/context/AuthContext";
import { useTransactions } from "@/src/context/TransactionsContext";
import { formatBRL, getMonthSummary, monthKey, monthLabel } from "@/src/utils";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DashboardScreen() {
  const { items, loading, loadFirstPage } = useTransactions();
  const { logout } = useAuth();

  const scrollRef = useRef<ScrollView>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao sair");
    }
  }, [logout]);

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
    return getMonthSummary(items as any[], currentMonth);
  }, [items, currentMonth]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <EmptyTransactionsState
        title="Dashboard"
        description="Você ainda não tem transações cadastradas."
        onCreatePress={() => router.navigate("/transactions")}
        onLogoutPress={handleLogout}
      />
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
      style={[
        styles.screen,
        { opacity: fade, transform: [{ translateY: slide }] },
      ]}
    >
      <View style={styles.fixedTop}>
        <DashboardHeader
          title="Dashboard"
          subtitle={`Resumo de ${monthLabel(currentMonth)}`}
          onLogout={handleLogout}
        />

        <ActionButton
          display="Ver Transações"
          onPress={() => router.navigate("/transactions")}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={chartsAnimatedStyle}>
          <SummaryCards
            income={monthData.income}
            expense={monthData.expense}
            balance={monthData.balance}
            formatValue={formatBRL}
          />
        </Animated.View>

        <Animated.View style={[styles.card, chartsAnimatedStyle]}>
          <ColumnChart items={items as any} />
        </Animated.View>

        <Animated.View style={[styles.card, chartsAnimatedStyle]}>
          <Top5ExpensesCard top5={monthData.top5} />
        </Animated.View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  fixedTop: {
    padding: 16,
    paddingBottom: 10,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E6EEF0",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },

  card: {
    marginTop: 10,
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 8,
  },
});
