import ActionButton from "@/src/components/ActionButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { auth } from "@/src/services/firebase";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      Alert.alert("Erro", "Digite seu email.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Email enviado",
        "Verifique sua caixa de entrada para redefinir a senha.",
      );

      router.replace("/");
    } catch (error: any) {
      Alert.alert("Erro", error?.message ?? "Erro ao enviar email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} />

      <View style={styles.inner}>
        <Text style={styles.title}>Recuperar senha</Text>

        <CustomTextInput
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <ActionButton
          display={loading ? "Enviando..." : "Enviar email"}
          onPress={handleReset}
        />

        <Text style={styles.backToLogin} onPress={() => router.replace("/")}>
          Voltar para login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    gap: 40,
  },
  inner: {
    width: "80%",
    gap: 16,
  },
  title: {
    color: "#024D60",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  backToLogin: {
    color: "#FF5031",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
});
