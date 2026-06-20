import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Calendar from "expo-calendar";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import Boton from "../components/Boton";
import { useMedStore } from "../store/useMedStore";
import { scheduleNotificacion } from "../utils/notifications";
import { agregarMed } from "../utils/storage";
import { validarHora } from "../utils/validation";

// Tipo generado con IA para la pantalla, esto se hizo para mantener el tipado fuerte
type AddMedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AddMed">;
};

export default function AddMedScreen({ navigation }: AddMedScreenProps) {
  const [nombre, setNombre] = useState("");
  const [dosis, setDosis] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<{
    latitude: number;
    longitude: number;
    direccion?: string;
  } | null>(null);
  const [contacto, setContacto] = useState<{
    id: string;
    nombre: string;
    telefono?: string;
    email?: string;
  } | null>(null);

  const addMedication = useMedStore((state) => state.addMedication);

  const handleGuardar = async () => {
    if (!nombre.trim() || !dosis.trim() || !hora.trim()) {
      Alert.alert("Faltan datos", "Nombre, dosis y hora son obligatorios");
      return;
    }

    if (!validarHora(hora.trim())) {
      Alert.alert("Hora invalida", "Usa el formato HH:MM, ej: 08:30");
      return;
    }

    setGuardando(true);

    try {
      const nuevaMed: any = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        dosis: dosis.trim(),
        hora: hora.trim(),
        notas: notas.trim() || undefined,
        creadoEn: Date.now(),
        imagenUri: imagenUri || undefined,
        ubicacion: ubicacion || undefined,
        contacto: contacto || undefined,
      };

      let eventoCalendarioId: string | undefined;

      const { status: calStatus } =
        await Calendar.requestCalendarPermissionsAsync();
      if (calStatus === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        const defaultCalendar =
          calendars.find((c) => c.isPrimary) || calendars[0];
        if (defaultCalendar) {
          const [horaS, minS] = hora.trim().split(":");
          const startDate = new Date();
          startDate.setHours(parseInt(horaS, 10), parseInt(minS, 10), 0, 0);
          if (startDate.getTime() <= Date.now()) {
            startDate.setDate(startDate.getDate() + 1);
          }
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
          eventoCalendarioId = await Calendar.createEventAsync(
            defaultCalendar.id,
            {
              title: `Tomar ${nombre.trim()}`,
              notes: `Dosis: ${dosis.trim()}${notas.trim() ? ` - ${notas.trim()}` : ""}`,
              startDate,
              endDate,
              alarms: [{ relativeOffset: -10 }],
            },
          );
        }
      }

      if (eventoCalendarioId) {
        nuevaMed.eventoCalendarioId = eventoCalendarioId;
      }

      await agregarMed(nuevaMed);
      addMedication(nuevaMed);

      await scheduleNotificacion(
        `Hora de tomar ${nuevaMed.nombre}`,
        `Dosis: ${nuevaMed.dosis}`,
        nuevaMed.hora,
      );

      Alert.alert("Guardado", "Medicación agregada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log("error guardando med", e);
      Alert.alert("Error", "No se pudo guardar la medicación");
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la galería para seleccionar una foto.",
        [
          { text: "OK" },
          { text: "Ir a Configuración", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const handleTomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la cámara para tomar una foto.",
        [
          { text: "OK" },
          { text: "Ir a Configuración", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const handleAgregarUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu ubicación para guardar la farmacia.",
        [
          { text: "OK" },
          { text: "Ir a Configuración", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = location.coords;

    let direccion: string | undefined;
    try {
      const [reverse] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (reverse) {
        direccion = `${reverse.street || ""} ${reverse.streetNumber || ""}, ${reverse.city || ""}`;
      }
    } catch (e) {
      console.log("reverse geocoding fallo", e);
    }

    setUbicacion({ latitude, longitude, direccion });
  };

  const handleSeleccionarContacto = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tus contactos para asociar un médico o familiar.",
        [
          { text: "OK" },
          { text: "Ir a Configuración", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
    });

    if (data.length === 0) {
      Alert.alert(
        "Sin contactos",
        "No se encontraron contactos en el dispositivo.",
      );
      return;
    }

    const contactosFormateados = data.map((c) => ({
      id: c.id,
      nombre: c.name,
      telefono: c.phoneNumbers?.[0]?.number,
      email: c.emails?.[0]?.email,
    }));

    Alert.alert("Seleccionar contacto", "Elegí un contacto para asociar:", [
      ...contactosFormateados.slice(0, 5).map((c) => ({
        text: c.nombre,
        onPress: () => setContacto(c),
      })),
      { text: "Cancelar", style: "cancel" as const, onPress: () => {} },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Nueva Medicación</Text>

        <Text style={styles.label}>Nombre del medicamento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Ibuprofeno"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Dosis *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 400mg"
          value={dosis}
          onChangeText={setDosis}
        />

        <Text style={styles.label}>Hora del recordatorio * (HH:MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 14:30"
          value={hora}
          onChangeText={setHora}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
        />

        <Text style={styles.label}>Notas (opcional)</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Ej: Tomar con comida"
          value={notas}
          onChangeText={setNotas}
          multiline
        />

        <View style={styles.seccion}>
          <Text style={styles.labelSec}>Foto del medicamento</Text>
          {imagenUri && (
            <Image source={{ uri: imagenUri }} style={styles.previewImagen} />
          )}
          <View style={styles.rowBotones}>
            <TouchableOpacity
              style={styles.btnSecundario}
              onPress={handleTomarFoto}
            >
              <Ionicons name="camera-outline" size={18} color="#1e90ff" />
              <Text style={styles.txtSecundario}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSecundario}
              onPress={handleAgregarFoto}
            >
              <Ionicons name="image-outline" size={18} color="#1e90ff" />
              <Text style={styles.txtSecundario}>Galería</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.labelSec}>Ubicación de la farmacia</Text>
          {ubicacion && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                <Ionicons name="location-outline" size={14} color="#32CD32" />{" "}
                {ubicacion.direccion ||
                  `${ubicacion.latitude.toFixed(4)}, ${ubicacion.longitude.toFixed(4)}`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.btnSecundario}
            onPress={handleAgregarUbicacion}
          >
            <Ionicons name="navigate-outline" size={18} color="#32CD32" />
            <Text style={styles.txtSecundario}>Obtener ubicación</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.labelSec}>Contacto (médico/familiar)</Text>
          {contacto && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                <Ionicons name="person-outline" size={14} color="#1e90ff" />{" "}
                {contacto.nombre}
              </Text>
              {contacto.telefono && (
                <Text style={styles.infoSub}>{contacto.telefono}</Text>
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.btnSecundario}
            onPress={handleSeleccionarContacto}
          >
            <Ionicons name="people-outline" size={18} color="#1e90ff" />
            <Text style={styles.txtSecundario}>Seleccionar contacto</Text>
          </TouchableOpacity>
        </View>

        <Boton
          titulo={guardando ? "Guardando..." : "Guardar"}
          onPress={handleGuardar}
          color="#1e90ff"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f8ff",
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  seccion: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  labelSec: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  previewImagen: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  rowBotones: {
    flexDirection: "row",
    gap: 8,
  },
  btnSecundario: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  txtSecundario: {
    marginLeft: 6,
    color: "#333",
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  infoSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
