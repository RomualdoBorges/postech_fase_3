import ActionButton from "@/src/components/ActionButton";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/src/constants/categories";
import { useAuth } from "@/src/context/AuthContext";
import { useTransactions } from "@/src/context/TransactionsContext";
import { pickReceiptFile, uploadReceipt } from "@/src/services/receipts";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

export default function AddTransactionScreen() {
  const { user } = useAuth();
  const { create, edit } = useTransactions();

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [receiptFile, setReceiptFile] = useState<any | null>(null);
  const [receiptPreviewName, setReceiptPreviewName] = useState<string>("");

  const categories = useMemo(
    () => (type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES),
    [type],
  );

  function normalizeMoneyInput(raw: string) {
    return raw.replace(",", ".");
  }

  function validate() {
    if (!title.trim()) return "Informe um título";
    const num = Number(normalizeMoneyInput(value));
    if (Number.isNaN(num) || num <= 0) return "Informe um valor válido (> 0)";
    return null;
  }

  async function handlePickReceipt() {
    try {
      const file = await pickReceiptFile();
      if (!file) return;

      setReceiptFile(file);
      setReceiptPreviewName(file?.name ?? "recibo selecionado");
      Alert.alert("OK", "Recibo selecionado ✅");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao selecionar recibo");
    }
  }

  async function handleSubmit() {
    const uid = user?.uid;
    if (!uid) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    const error = validate();
    if (error) {
      Alert.alert("Validação", error);
      return;
    }

    try {
      const transactionId = await create({
        title: title.trim(),
        category,
        value: Number(normalizeMoneyInput(value)),
        type,
        date: new Date(),
      });

      if (receiptFile) {
        const up = await uploadReceipt({
          uid,
          transactionId,
          file: receiptFile,
        });

        await edit(transactionId, {
          receiptUrl: up.receiptUrl,
          receiptPath: up.receiptPath,
          receiptName: up.receiptName,
          receiptType: up.receiptType,
        });
      }

      Alert.alert(
        "OK",
        receiptFile ? "Transação + recibo salvos ✅" : "Transação criada ✅",
      );
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao salvar transação");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Nova Transação</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <ActionButton
          display={type === "expense" ? "✅ Despesa" : "Despesa"}
          buttonType="small"
          onPress={() => {
            setType("expense");
            setCategory(EXPENSE_CATEGORIES[0]);
          }}
        />
        <ActionButton
          display={type === "income" ? "✅ Receita" : "Receita"}
          buttonType="small"
          onPress={() => {
            setType("income");
            setCategory(INCOME_CATEGORIES[0]);
          }}
        />
      </View>

      <TextInput
        placeholder="Título (ex: Mercado)"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Valor (ex: 120.50)"
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <View style={{ borderWidth: 1, borderRadius: 8, overflow: "hidden" }}>
        <Picker
          selectedValue={category}
          onValueChange={(v) => setCategory(String(v))}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <ActionButton
        display="Selecionar recibo (imagem/PDF)"
        onPress={handlePickReceipt}
      />
      {receiptFile ? (
        <Text>Recibo selecionado: {receiptPreviewName}</Text>
      ) : (
        <Text>Nenhum recibo selecionado.</Text>
      )}

      <ActionButton display="Salvar" onPress={handleSubmit} />
    </View>
  );
}
