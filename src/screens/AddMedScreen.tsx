import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Medication, agregarMed } from '../utils/storage';
import { scheduleNotificacion } from '../utils/notifications';
import Boton from '../components/Boton';

type AddMedScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddMed'>;
};

function formatearHora(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function AddMedScreen({ navigation }: AddMedScreenProps) {
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [horaDate, setHoraDate] = useState(new Date());
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const onChangeHora = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setMostrarPicker(false);
    if (selectedDate) {
      setHoraDate(selectedDate);
    }
  };

  const handleGuardar = async () => {
    const horaStr = formatearHora(horaDate);

    if (!nombre.trim() || !dosis.trim()) {
      Alert.alert('Faltan datos', 'Nombre y dosis son obligatorios');
      return;
    }

    setGuardando(true);

    try {
      const nuevaMed: Medication = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        dosis: dosis.trim(),
        hora: horaStr,
        notas: notas.trim() || undefined,
        creadoEn: Date.now(),
      };

      await agregarMed(nuevaMed);

      const notiId = await scheduleNotificacion(
        `Hora de tomar ${nuevaMed.nombre}`,
        `Dosis: ${nuevaMed.dosis}`,
        nuevaMed.hora
      );

      if (notiId) {
        console.log('notificacion agendada con id:', notiId);
      } else {
        console.log('no se pudo agendar notificacion, tal vez no hay permisos');
      }

      Alert.alert('Guardado', 'Medicación agregada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log('error guardando med', e);
      Alert.alert('Error', 'No se pudo guardar la medicación');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

        <Text style={styles.label}>Hora del recordatorio *</Text>
        <TouchableOpacity
          style={styles.selectorHora}
          onPress={() => setMostrarPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.textoHora}>{formatearHora(horaDate)}</Text>
        </TouchableOpacity>

        {mostrarPicker && (
          <DateTimePicker
            value={horaDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeHora}
          />
        )}

        <Text style={styles.label}>Notas (opcional)</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Ej: Tomar con comida"
          value={notas}
          onChangeText={setNotas}
          multiline
        />

        <Boton
          titulo={guardando ? 'Guardando...' : 'Guardar'}
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
    backgroundColor: '#f0f8ff',
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selectorHora: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  textoHora: {
    fontSize: 16,
    color: '#333',
  },
});
