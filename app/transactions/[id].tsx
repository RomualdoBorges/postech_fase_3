import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/src/constants/categories";
import { useAuth } from "@/src/context/AuthContext";
import { useTransactions } from "@/src/context/TransactionsContext";
import { pickReceiptFile, uploadReceipt } from "@/src/services/receipts";
import { Picker } from "@react-native-picker/picker";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuth();
  const { items, edit, remove } = useTransactions();

  const current = useMemo(() => items.find((t) => t.id === id), [items, id]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const categories = useMemo(
    () => (type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES),
    [type],
  );

  useEffect(() => {
    if (!current) return;

    const initialType = current.type;
    const initialCats =
      initialType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    setTitle(current.title);
    setValue(String(current.value));
    setType(initialType);

    if (current.category && initialCats.includes(current.category)) {
      setCategory(current.category);
    } else {
      setCategory(initialCats[0] ?? "Outros");
    }
  }, [current]);

  useEffect(() => {
    if (!categories.length) return;
    if (!category || !categories.includes(category)) {
      setCategory(categories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (!id) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text>ID inválido.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  if (!current) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text>Transação não encontrada (talvez não carregou ainda).</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  function normalizeMoneyInput(raw: string) {
    // aceita "120,50" e "120.50"
    return raw.replace(",", ".");
  }

  function validate() {
    if (!title.trim()) return "Informe um título";
    if (!category.trim()) return "Informe uma categoria";

    const num = Number(normalizeMoneyInput(value));
    if (Number.isNaN(num) || num <= 0) return "Informe um valor válido (> 0)";

    return null;
  }

  async function handleSave() {
    const error = validate();
    if (error) {
      Alert.alert("Validação", error);
      return;
    }

    await edit(id, {
      title: title.trim(),
      category,
      value: Number(normalizeMoneyInput(value)),
      type,
      date: new Date(),
    });

    Alert.alert("OK", "Transação atualizada ✅");
    router.back();
  }

  async function handleDelete() {
    await remove(id);
    Alert.alert("OK", "Transação removida ✅");
    router.replace("/transactions");
  }

  async function handleAttachReceipt() {
    try {
      const uid = user?.uid;
      if (!uid) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const file = await pickReceiptFile();
      if (!file) return;

      const up = await uploadReceipt({
        uid,
        transactionId: id,
        file,
      });

      await edit(id, {
        receiptUrl: up.receiptUrl,
        receiptPath: up.receiptPath,
        receiptName: up.receiptName,
        receiptType: up.receiptType,
      });

      Alert.alert("OK", "Recibo anexado ✅");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao anexar recibo");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Editar Transação</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          title={type === "expense" ? "✅ Despesa" : "Despesa"}
          onPress={() => setType("expense")}
        />
        <Button
          title={type === "income" ? "✅ Receita" : "Receita"}
          onPress={() => setType("income")}
        />
      </View>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Valor"
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
          {categories.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>

      <Button title="Salvar alterações" onPress={handleSave} />

      <Button
        title="Anexar recibo (imagem/PDF)"
        onPress={handleAttachReceipt}
      />

      {current.receiptUrl ? (
        <View style={{ gap: 8 }}>
          <Text>Recibo: {current.receiptName ?? "anexado"}</Text>
          <Button
            title="Ver recibo"
            onPress={() => Linking.openURL(current.receiptUrl!)}
          />
        </View>
      ) : (
        <Text>Nenhum recibo anexado.</Text>
      )}

      <Button title="Excluir" color="red" onPress={handleDelete} />
    </View>
  );
}
