import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// props del boton
interface BotonProps {
  titulo: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// componente reutilizable
export default function Boton({
  titulo,
  onPress,
  color = "#007AFF",
  style,
  textStyle,
}: BotonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.boton, { backgroundColor: color }, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.texto, textStyle]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
    // sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  texto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
