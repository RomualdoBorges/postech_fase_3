import ActionButton from "@/src/components/ActionButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { register } from "../src/services/auth";

export default function Register() {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleRegister() {
    try {
      await register(newEmail, newPassword);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/dashboard");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha no cadastro");
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} />

      <View style={styles.inner}>
        <Text style={styles.title}>Criar Conta</Text>

        <CustomTextInput
          placeholder="E-mail"
          autoCapitalize="none"
          value={newEmail}
          onChangeText={setNewEmail}
        />

        <CustomTextInput
          placeholder="Senha"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <ActionButton
          display="Cadastrar"
          onPress={handleRegister}
          backgroundColor="#FF5031"
        />

        <Text style={styles.link} onPress={() => router.back()}>
          Já tenho conta
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
    gap: 16,
    width: "80%",
  },
  title: {
    color: "#024D60",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    color: "#024D60",
    marginTop: 10,
  },
});
