import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

import {
  addTransaction,
  deleteTransaction,
  listTransactionsPage,
  updateTransaction,
  type Transaction,
  type TransactionFilters,
  type TransactionInput,
} from "../services/transactions";

type TransactionsSummary = {
  income: number;
  expense: number;
  balance: number;
  byCategory: { category: string; total: number }[];
};

type TransactionsContextType = {
  items: Transaction[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  filters: TransactionFilters;
  setFilters: (f: TransactionFilters) => void;
  summary: TransactionsSummary;
  loadFirstPage: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
  create: (data: TransactionInput) => Promise<string>;
  edit: (id: string, data: Partial<TransactionInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [items, setItems] = useState<Transaction[]>([]);
  const [filters, setFiltersState] = useState<TransactionFilters>({
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [hasMore, setHasMore] = useState(true);

  const pageSize = 10;

  const summary = useMemo<TransactionsSummary>(() => {
    const income = items
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + (t.value ?? 0), 0);

    const expense = items
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + (t.value ?? 0), 0);

    const balance = income - expense;

    const byCategoryMap = new Map<string, number>();
    for (const t of items) {
      const key = t.category ?? "Sem categoria";
      byCategoryMap.set(key, (byCategoryMap.get(key) ?? 0) + (t.value ?? 0));
    }

    const byCategory = Array.from(byCategoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    return { income, expense, balance, byCategory };
  }, [items]);

  const loadFirstPage = useCallback(async () => {
    try {
      if (!user?.uid) return;

      setLoading(true);
      setHasMore(true);
      setLastDoc(null);

      const res = await listTransactionsPage(user.uid, {
        pageSize,
        lastDoc: null,
        filters,
      });

      setItems(res.items);
      setLastDoc(res.lastDoc);
      setHasMore(res.hasMore);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao carregar transações");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, filters]);

  const loadNextPage = useCallback(async () => {
    try {
      if (!user?.uid) return;
      if (!hasMore) return;
      if (!lastDoc) return;

      setLoadingMore(true);

      const res = await listTransactionsPage(user.uid, {
        pageSize,
        lastDoc,
        filters,
      });

      setItems((prev) => [...prev, ...res.items]);
      setLastDoc(res.lastDoc);
      setHasMore(res.hasMore);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao carregar mais itens");
    } finally {
      setLoadingMore(false);
    }
  }, [user?.uid, hasMore, lastDoc, filters]);

  const refresh = useCallback(async () => {
    await loadFirstPage();
  }, [loadFirstPage]);

  const create = useCallback(
    async (data: TransactionInput): Promise<string> => {
      try {
        if (!user?.uid) {
          throw new Error("Usuário não autenticado");
        }

        const transactionId = await addTransaction(user.uid, data);

        await loadFirstPage();

        return transactionId;
      } catch (e: any) {
        Alert.alert("Erro", e?.message ?? "Falha ao criar transação");
        throw e;
      }
    },
    [user?.uid, loadFirstPage],
  );

  const edit = useCallback(
    async (id: string, data: Partial<TransactionInput>) => {
      try {
        if (!user?.uid) return;
        await updateTransaction(user.uid, id, data);
        await loadFirstPage();
      } catch (e: any) {
        Alert.alert("Erro", e?.message ?? "Falha ao editar transação");
        throw e;
      }
    },
    [user?.uid, loadFirstPage],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        if (!user?.uid) return;
        await deleteTransaction(user.uid, id);
        await loadFirstPage();
      } catch (e: any) {
        Alert.alert("Erro", e?.message ?? "Falha ao remover transação");
        throw e;
      }
    },
    [user?.uid, loadFirstPage],
  );

  const setFilters = useCallback((f: TransactionFilters) => {
    setFiltersState(f);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    loadFirstPage();
  }, [user?.uid, filters, loadFirstPage]);

  useEffect(() => {
    if (user?.uid) return;

    setItems([]);
    setHasMore(true);
    setLastDoc(null);
    setLoading(false);
    setLoadingMore(false);
  }, [user?.uid]);

  const value = useMemo(
    () => ({
      items,
      loading,
      loadingMore,
      hasMore,
      filters,
      setFilters,
      summary,
      loadFirstPage,
      loadNextPage,
      refresh,
      create,
      edit,
      remove,
    }),
    [
      items,
      loading,
      loadingMore,
      hasMore,
      filters,
      setFilters,
      summary,
      loadFirstPage,
      loadNextPage,
      refresh,
      create,
      edit,
      remove,
    ],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error(
      "useTransactions deve ser usado dentro de TransactionsProvider",
    );
  }
  return ctx;
}
