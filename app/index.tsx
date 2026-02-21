import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { auth, db } from "../src/services/firebase";

async function ensureUserDoc() {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      await ensureUserDoc();

      router.navigate("/dashboard");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha no login");
    }
  }

  async function handleRegister() {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      await ensureUserDoc();

      router.navigate("/dashboard");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha no cadastro");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar conta" onPress={handleRegister} />
    </View>
  );
}
