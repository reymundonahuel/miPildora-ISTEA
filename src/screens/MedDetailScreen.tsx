import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { RootStackParamList } from "../../App";
import Boton from "../components/Boton";
import { useMedStore } from "../store/useMedStore";
import { eliminarMed } from "../utils/storage";

/* Funciones generadas con IA:
- Ver mapa
- Llamar a contacto
- Estilos

 */

type MedDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MedDetail"
>;

export default function MedDetailScreen({
  navigation,
  route,
}: MedDetailScreenProps) {
  const { medId } = route.params;
  const medications = useMedStore((state) => state.medications);
  const removeMedication = useMedStore((state) => state.removeMedication);

  const med = medications.find((m) => m.id === medId);

  if (!med) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Medicamento no encontrado</Text>
        <Boton titulo="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleEliminar = () => {
    Alert.alert("Eliminar", `¿Seguro que queres eliminar ${med.nombre}?`, [
      { text: "Cancelar", style: "cancel" as const },
      {
        text: "Eliminar",
        style: "destructive" as const,
        onPress: async () => {
          await eliminarMed(med.id);
          removeMedication(med.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleLlamarContacto = () => {
    if (med.contacto?.telefono) {
      Linking.openURL(`tel:${med.contacto.telefono}`);
    } else {
      Alert.alert("Sin teléfono", "Este contacto no tiene número de teléfono.");
    }
  };

  const handleVerMapa = () => {
    if (med.ubicacion) {
      const url = `https://maps.google.com/?q=${med.ubicacion.latitude},${med.ubicacion.longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      {med.imagenUri && (
        <Image source={{ uri: med.imagenUri }} style={styles.imagen} />
      )}

      <Text style={styles.nombre}>{med.nombre}</Text>
      <Text style={styles.dosis}>{med.dosis}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color="#1e90ff" />
        <Text style={styles.infoText}>Hora: {med.hora}</Text>
      </View>

      {med.notas && (
        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={20} color="#888" />
          <Text style={styles.infoText}>{med.notas}</Text>
        </View>
      )}

      {med.ubicacion && (
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#32CD32" />
            <Text style={styles.infoText}>
              {med.ubicacion.direccion ||
                `${med.ubicacion.latitude.toFixed(4)}, ${med.ubicacion.longitude.toFixed(4)}`}
            </Text>
          </View>
          <Boton titulo="Ver en mapa" onPress={handleVerMapa} color="#32CD32" />
        </View>
      )}

      {med.contacto && (
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#1e90ff" />
            <Text style={styles.infoText}>{med.contacto.nombre}</Text>
          </View>
          {med.contacto.telefono && (
            <Text style={styles.subText}>Tel: {med.contacto.telefono}</Text>
          )}
          {med.contacto.email && (
            <Text style={styles.subText}>Email: {med.contacto.email}</Text>
          )}
          <Boton
            titulo="Llamar"
            onPress={handleLlamarContacto}
            color="#1e90ff"
          />
        </View>
      )}

      {med.eventoCalendarioId && (
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#ff8c00" />
          <Text style={styles.infoText}>
            Recordatorio agendado en el calendario
          </Text>
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <Boton
          titulo="Eliminar medicación"
          onPress={handleEliminar}
          color="#ff4444"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  error: {
    fontSize: 18,
    color: "#ff4444",
    textAlign: "center",
    marginVertical: 24,
  },
  imagen: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  nombre: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  dosis: {
    fontSize: 18,
    color: "#555",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 28,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
