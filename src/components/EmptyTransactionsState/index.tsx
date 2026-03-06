import ActionButton from "@/src/components/ActionButton";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  description?: string;
  onCreatePress: () => void;
  onLogoutPress?: () => void;
};

export function EmptyTransactionsState({
  title = "Nenhuma transação encontrada",
  description = "Adicione sua primeira transação para acompanhar saldo e gastos do mês.",
  onCreatePress,
  onLogoutPress,
}: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/favicon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.actions}>
          <ActionButton
            display="Adicionar transação"
            onPress={onCreatePress}
            backgroundColor="#004D61"
          />

          {onLogoutPress && (
            <ActionButton
              display="Sair"
              onPress={onLogoutPress}
              backgroundColor="#FF5031"
            />
          )}
        </View>

        <Text style={styles.hint}>
          Dica: registre também despesas pequenas — elas fazem diferença no fim
          do mês.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DEE9EA",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#DEE9EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#004D61",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  description: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: "#475467",
    lineHeight: 20,
  },

  actions: {
    marginTop: 18,
    width: "100%",
    gap: 12,
  },

  hint: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: "#667085",
    lineHeight: 18,
  },
});
