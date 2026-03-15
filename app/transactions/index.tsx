import { useTransactions } from "@/src/context/TransactionsContext";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/src/constants/categories";
import ActionButton from "@/src/components/ActionButton";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function startOfMonth(d: Date) {
  return startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));
}

function endOfMonth(d: Date) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

type TypeFilterOption = "(Todos)" | "income" | "expense";

type DatePreset =
  | "(Qualquer data)"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth";

function presetToRange(preset: DatePreset) {
  const now = new Date();

  if (preset === "(Qualquer data)") {
    return { dateFrom: undefined, dateTo: undefined };
  }

  if (preset === "last7") {
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    return { dateFrom: startOfDay(from), dateTo: endOfDay(now) };
  }

  if (preset === "last30") {
    const from = new Date(now);
    from.setDate(from.getDate() - 29);
    return { dateFrom: startOfDay(from), dateTo: endOfDay(now) };
  }

  if (preset === "thisMonth") {
    return { dateFrom: startOfMonth(now), dateTo: endOfDay(now) };
  }

  const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { dateFrom: startOfMonth(last), dateTo: endOfMonth(last) };
}

export default function TransactionsListScreen() {
  const {
    items,
    loading,
    loadingMore,
    hasMore,
    loadFirstPage,
    loadNextPage,
    refresh,
    remove,
    filters,
    setFilters,
  } = useTransactions();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFilters({ order: "desc" });
      };
    }, [setFilters]),
  );

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [draftType, setDraftType] = useState<TypeFilterOption>("(Todos)");
  const [draftCategory, setDraftCategory] = useState<string>("(Todas)");
  const [draftDatePreset, setDraftDatePreset] =
    useState<DatePreset>("(Qualquer data)");
    
  const categories = useMemo(() => {
    const set = new Set<string>();
    const categories = draftType === "income" ?
      INCOME_CATEGORIES : draftType === "expense" ? 
        EXPENSE_CATEGORIES : [];
    
    for (const t of categories) {
      set.add(t);
    }
    return ["(Todas)", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    
  }, [draftType]);
  useEffect(() => {
    if (!filtersOpen) return;

    setDraftType(filters.type ? filters.type : "(Todos)");
    setDraftCategory(filters.category ? filters.category : "(Todas)");
  }, [filtersOpen, filters.type, filters.category]);

  const slide = useRef(new Animated.Value(0)).current; // 0 fechado, 1 aberto

  function openFilters() {
    setFiltersOpen(true);
    Animated.timing(slide, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }

  function closeFilters(callback?: () => void) {
    Animated.timing(slide, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setFiltersOpen(false);
      callback?.();
    });
  }

  const sheetTranslateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [420, 0],
  });

  const backdropOpacity = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  function applyDraftFilters() {
    const type = draftType === "(Todos)" ? undefined : draftType;
    const category = draftCategory === "(Todas)" ? undefined : draftCategory;
    const { dateFrom, dateTo } = presetToRange(draftDatePreset);

    setFilters({
      ...filters,
      type,
      category,
      dateFrom,
      dateTo,
    });

    closeFilters();
  }

  function clearDraftAndFilters() {
    setDraftType("(Todos)");
    setDraftCategory("(Todas)");
    setDraftDatePreset("(Qualquer data)");

    setFilters({
      ...filters,
      type: undefined,
      category: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });

    closeFilters();
  }

  const hasActiveFilters =
    !!filters.type ||
    !!filters.category ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <ActionButton
        display="Nova transação"
        onPress={() => router.push("/transactions/add")}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <ActionButton
          display={hasActiveFilters ? "Filtros (ativos)" : "Filtros"}
          onPress={openFilters}
        />
        <ActionButton display="Recarregar" onPress={loadFirstPage} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        onRefresh={refresh}
        refreshing={loading}
        onEndReached={() => {
          if (hasMore && !loadingMore) loadNextPage();
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <Text style={{ marginTop: 16 }}>Nenhuma transação encontrada.</Text>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const valueText =
            item.type === "expense"
              ? `- ${formatBRL(item.value)}`
              : `+ ${formatBRL(item.value)}`;

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/transactions/[id]",
                  params: { id: item.id },
                })
              }
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.title}
              </Text>
              <Text>{item.category}</Text>
              <Text>{valueText}</Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <ActionButton
                  display="Editar"
                  onPress={() =>
                    router.push({
                      pathname: "/transactions/[id]",
                      params: { id: item.id },
                    })
                  }
                />
                <ActionButton
                  display="Excluir"
                  backgroundColor="red"
                  onPress={() => remove(item.id)}
                />
              </View>
            </Pressable>
          );
        }}
      />

      {filtersOpen ? (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "flex-end",
          }}
        >
          <TouchableWithoutFeedback onPress={() => closeFilters()}>
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: "black",
                opacity: backdropOpacity,
              }}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={{
              transform: [{ translateY: sheetTranslateY }],
              backgroundColor: "white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              gap: 12,
              borderWidth: 1,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 4 }}>
              <View
                style={{
                  width: 50,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: "#ccc",
                }}
              />
            </View>

            <Text style={{ fontSize: 16, fontWeight: "700" }}>Filtros</Text>

            <View
              style={{ borderWidth: 1, borderRadius: 8, overflow: "hidden" }}
            >
              <Picker
                selectedValue={draftType}
                onValueChange={(v) =>
                  setDraftType(String(v) as TypeFilterOption)
                }
              >
                <Picker.Item label="(Todos os tipos)" value="(Todos)" />
                <Picker.Item label="Receitas" value="income" />
                <Picker.Item label="Despesas" value="expense" />
              </Picker>
            </View>

            <View
              style={{ borderWidth: 1, borderRadius: 8, overflow: "hidden" }}
            >
              <Picker
                selectedValue={draftCategory}
                onValueChange={(v) => setDraftCategory(String(v))}
              >
                {categories.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>

            <View
              style={{ borderWidth: 1, borderRadius: 8, overflow: "hidden" }}
            >
              <Picker
                selectedValue={draftDatePreset}
                onValueChange={(v) =>
                  setDraftDatePreset(String(v) as DatePreset)
                }
              >
                <Picker.Item label="(Qualquer data)" value="(Qualquer data)" />
                <Picker.Item label="Últimos 7 dias" value="last7" />
                <Picker.Item label="Últimos 30 dias" value="last30" />
                <Picker.Item label="Este mês" value="thisMonth" />
                <Picker.Item label="Mês passado" value="lastMonth" />
              </Picker>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <ActionButton display="Aplicar" onPress={applyDraftFilters} />
              <ActionButton display="Limpar" onPress={clearDraftAndFilters} />
            </View>

            <ActionButton display="Fechar" onPress={() => closeFilters()} />
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}
