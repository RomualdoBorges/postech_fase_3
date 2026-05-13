import { type Timestamp } from "firebase/firestore";

type TransactionType = "income" | "expense";

type ReceiptMeta = {
  receiptUrl?: string;
  receiptPath?: string;
  receiptName?: string;
  receiptType?: string; // mimeType
};

export type TransactionInput = {
  title: string;
  value: number;
  type: TransactionType;
  category: string;
  date: Date;
} & ReceiptMeta;

export type Transaction = {
  id: string;
  title: string;
  value: number;
  type: TransactionType;
  category: string;
  date: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} & ReceiptMeta;

export type TransactionFilters = {
  type?: TransactionType;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minValue?: number;
  maxValue?: number;
  order?: "asc" | "desc";
};

export type TransactionsSummary = {
  income: number;
  expense: number;
  balance: number;
  byCategory: { category: string; total: number }[];
};
