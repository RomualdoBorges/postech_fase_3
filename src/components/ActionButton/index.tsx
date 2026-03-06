import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ActionButtonProps {
  onPress: () => void;
  display: string;
  backgroundColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  display,
  backgroundColor = "#024D60",
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{display}</Text>
    </Pressable>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
