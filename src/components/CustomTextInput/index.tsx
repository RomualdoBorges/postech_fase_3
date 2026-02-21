import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  value?: string;
  onChangeText?: (text: string) => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "none",
  value,
  onChangeText,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = secureTextEntry;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#024D6060"
        secureTextEntry={isPasswordField && !isPasswordVisible}
        autoCapitalize={autoCapitalize}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />

      {isPasswordField && (
        <Pressable
          style={styles.icon}
          onPress={() => setIsPasswordVisible((prev) => !prev)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={22}
            color="#024D60"
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 56,
    paddingLeft: 10,
    paddingRight: 45,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#024D60",
    fontSize: 16,
    color: "#024D60",
  },
  icon: {
    position: "absolute",
    right: 12,
  },
});

export default CustomTextInput;
