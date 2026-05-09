import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import Boton from "../components/Boton";
import { eliminarMed, Medication, traerMeds } from "../utils/storage";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [contador, setContador] = useState(0); // no se para que puse esto, despues lo saco

  const cargarMeds = async () => {
    const data = await traerMeds();
    // ordenar por hora
    data.sort((a, b) => a.hora.localeCompare(b.hora));
    setMeds(data);
  };

  useFocusEffect(
    useCallback(() => {
      cargarMeds();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarMeds();
    setRefreshing(false);
  };

  const handleEliminar = (med: Medication) => {
    Alert.alert("Eliminar", `¿Seguro que queres eliminar ${med.nombre}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await eliminarMed(med.id);
          await cargarMeds();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Medication }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombreMed}>{item.nombre}</Text>
        <Text style={styles.detalle}>Dosis: {item.dosis}</Text>
        <Text style={styles.detalle}>Hora: {item.hora}</Text>
        {item.notas ? (
          <Text style={styles.notas}>Nota: {item.notas}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() => handleEliminar(item)}
        style={styles.btnBorrar}
      >
        <Ionicons name="trash-outline" size={22} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {meds.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tenes medicamentos cargados</Text>
            <Text style={styles.emptySub}>
              Tocá el boton de abajo para agregar uno
            </Text>
          </View>
        ) : (
          <FlatList
            data={meds}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        <View style={styles.footer}>
          <Boton
            titulo="+ Agregar Medicación"
            onPress={() => navigation.navigate("AddMed")}
            color="#1e90ff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    // sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nombreMed: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  detalle: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  notas: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
    fontStyle: "italic",
  },
  btnBorrar: {
    padding: 8,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
