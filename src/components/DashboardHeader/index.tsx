import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  onLogout: () => void;
};

export function DashboardHeader({ title, subtitle, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../../../assets/images/favicon.png")}
          style={styles.logo}
        />

        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#667085",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#FF5031",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "800",
  },
});
