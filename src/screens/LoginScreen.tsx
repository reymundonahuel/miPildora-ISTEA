import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { traerUsuario } from '../utils/storage';
import Boton from '../components/Boton';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !pass.trim()) {
      Alert.alert('Faltan datos', 'Completa usuario y contraseña');
      return;
    }

    console.log('debug: intentando login con', usuario); // saqué esto de un tutorial

    setCargando(true);
    try {
      const userGuardado = await traerUsuario();
      if (!userGuardado) {
        Alert.alert('Error', 'No hay ningun usuario registrado. Creá uno primero.');
        return;
      }

      if (userGuardado.username === usuario.trim() && userGuardado.password === pass.trim()) {
        // login ok
        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (e) {
      console.log('error en login', e);
      Alert.alert('Error', 'Algo salio mal');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>MiPildora</Text>
        <Text style={styles.subtitulo}>Recordatorio de medicación</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu usuario"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu contraseña"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />

          <Boton titulo={cargando ? 'Entrando...' : 'Iniciar Sesión'} onPress={handleLogin} />

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }}>
            <Text style={styles.link}>¿No tenes cuenta? Registrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e90ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    // sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    backgroundColor: '#fafafa',
  },
  link: {
    color: '#1e90ff',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
