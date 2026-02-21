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
      style={[styles.contextButtonActive, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.contextButtonText}>{display}</Text>
    </Pressable>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  contextButtonActive: {
    borderRadius: 8,
  },
  contextButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 12,
    textAlign: "center",
  },
});
