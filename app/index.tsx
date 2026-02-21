import ActionButton from "@/src/components/ActionButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { login } from "../src/services/auth";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha no login");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require("../assets/images/logo.png")} />

          <View style={styles.inner}>
            <Text style={styles.title}>Login</Text>

            <CustomTextInput
              placeholder="E-mail"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <CustomTextInput
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text
              style={styles.forgot}
              onPress={() => router.push("/forgot-password")}
            >
              Esqueceu sua senha?
            </Text>

            <ActionButton display="Entrar" onPress={handleLogin} />

            <Text style={styles.registerText}>
              Não tem uma conta?{" "}
              <Text
                style={styles.registerLink}
                onPress={() => router.push("/register")}
              >
                Cadastre-se
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    fontWeight: 600,
  },
  forgot: {
    color: "#FF5031",
    textAlign: "right",
    marginBottom: 18,
  },
  registerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },

  registerLink: {
    color: "#FF5031",
    fontWeight: "600",
  },
});
