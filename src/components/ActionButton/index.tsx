import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ActionButtonProps {
  onPress: () => void;
  display: string;
  backgroundColor?: string;
  buttonType?: "small" | "medium";
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  display,
  backgroundColor = "#024D60",
  buttonType = "medium",
  disabled = false,
}) => {

  const stylesButton = buttonType === "medium" ? styles.buttonMedium : styles.buttonSmall;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        stylesButton,
        disabled ? {backgroundColor: "#024d607a"} : {backgroundColor},
        pressed && styles.pressed,
      ]}
      disabled={disabled}
    >
      <Text style={styles.text}>{display}</Text>
    </Pressable>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  buttonMedium: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSmall: {
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
    paddingHorizontal: 10,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
