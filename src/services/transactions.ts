import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore";

import { Transaction, TransactionFilters, TransactionInput } from "../types/transactions";
import { db } from "./firebase";

type PaginatedResult<T> = {
  items: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
};

function transactionsCol(uid: string) {
  return collection(db, "users", uid, "transactions");
}

function normalizeText(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function addTransaction(
  uid: string,
  data: TransactionInput,
): Promise<string> {
  const colRef = transactionsCol(uid);

  const docRef = await addDoc(colRef, {
    ...data,
    categoryNorm: normalizeText(data.category),
    date: data.date,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTransactionById(
  uid: string,
  transactionId: string,
): Promise<Transaction | null> {
  const ref = doc(db, "users", uid, "transactions", transactionId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Transaction, "id">),
  };
}

export async function updateTransaction(
  uid: string,
  transactionId: string,
  data: Partial<Omit<TransactionInput, "date">> & { date?: Date },
): Promise<void> {
  const ref = doc(db, "users", uid, "transactions", transactionId);

  await updateDoc(ref, {
    ...data,
    ...(data.date ? { date: data.date } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTransaction(
  uid: string,
  transactionId: string,
): Promise<void> {
  const ref = doc(db, "users", uid, "transactions", transactionId);
  await deleteDoc(ref);
}

export async function listTransactionsPage(
  uid: string,
  params?: {
    pageSize?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
    filters?: TransactionFilters;
  },
): Promise<PaginatedResult<Transaction>> {
  const pageSize = params?.pageSize ?? 10;
  const lastDoc = params?.lastDoc ?? null;
  const filters = params?.filters;

  const constraints: any[] = [];

  if (filters?.type) constraints.push(where("type", "==", filters.type));
  if (filters?.category)
    constraints.push(
      where("categoryNorm", "==", normalizeText(filters.category)),
    );

  if (filters?.dateFrom)
    constraints.push(where("date", ">=", filters.dateFrom));
  if (filters?.dateTo) constraints.push(where("date", "<=", filters.dateTo));

  if (typeof filters?.minValue === "number")
    constraints.push(where("value", ">=", filters.minValue));
  if (typeof filters?.maxValue === "number")
    constraints.push(where("value", "<=", filters.maxValue));

  const orderDirection = filters?.order ?? "desc";
  constraints.push(orderBy("date", orderDirection));

  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(pageSize));

  const q = query(transactionsCol(uid), ...constraints);
  const snap = await getDocs(q);

  const items: Transaction[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Transaction, "id">),
  }));

  const newLastDoc =
    snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

  return {
    items,
    lastDoc: newLastDoc,
    hasMore: snap.docs.length === pageSize,
  };
}
