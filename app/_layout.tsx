import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { TransactionsProvider } from "@/src/context/TransactionsContext";
import { Redirect, Stack, usePathname } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

function AuthGate() {
  const { user, loadingAuth } = useAuth();
  const pathname = usePathname();

  const isPublic =
    pathname === "/" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user && !isPublic) {
    return <Redirect href="/" />;
  }

  if (user && isPublic) {
    return <Redirect href="/dashboard" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="register"
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#004D61",
          },
          headerTintColor: "#FFFFFF",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#004D61",
          },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="dashboard"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="transactions/index"
        options={{ title: "Transações" }}
      />
      <Stack.Screen
        name="transactions/add"
        options={{ title: "Nova Transação" }}
      />
      <Stack.Screen
        name="transactions/[id]"
        options={{ title: "Editar Transação" }}
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <AuthGate />
      </TransactionsProvider>
    </AuthProvider>
  );
}
