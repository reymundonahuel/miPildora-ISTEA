import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { guardarUsuario, traerUsuario } from '../utils/storage';
import Boton from '../components/Boton';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');

  const handleRegistro = async () => {
    if (!user.trim() || !pass.trim() || !pass2.trim()) {
      Alert.alert('Faltan datos', 'Completa todos los campos');
      return;
    }

    if (pass !== pass2) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (pass.length < 4) {
      Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres');
      return;
    }

    try {
      const existe = await traerUsuario();
      if (existe) {
        Alert.alert('Error', 'Ya existe un usuario registrado. Solo se permite uno.');
        return;
      }

      await guardarUsuario({ username: user.trim(), password: pass.trim() });
      Alert.alert('Éxito', 'Usuario creado. Ahora inicia sesión.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log('error registro', e);
      Alert.alert('Error', 'No se pudo guardar el usuario');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Crear Cuenta</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Elegi un usuario"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Elegi una contraseña"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
        />

        <Text style={styles.label}>Repetir Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeti la contraseña"
          value={pass2}
          onChangeText={setPass2}
          secureTextEntry
        />

        <Boton titulo="Registrarme" onPress={handleRegistro} color="#32CD32" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
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
});
