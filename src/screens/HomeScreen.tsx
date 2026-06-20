import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { traerMeds, eliminarMed } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useMedStore } from '../store/useMedStore';
import Boton from '../components/Boton';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const medications = useMedStore((state) => state.medications);
  const setMedications = useMedStore((state) => state.setMedications);
  const removeMedication = useMedStore((state) => state.removeMedication);
  const [refreshing, setRefreshing] = useState(false);

  const cargarMeds = async () => {
    const data = await traerMeds();
    data.sort((a, b) => a.hora.localeCompare(b.hora));
    setMedications(data);
  };

  useFocusEffect(
    useCallback(() => {
      cargarMeds();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarMeds();
    setRefreshing(false);
  };

  const handleEliminar = (id: string, nombre: string) => {
    Alert.alert(
      'Eliminar',
      `¿Seguro que queres eliminar ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarMed(id);
            removeMedication(id);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MedDetail', { medId: item.id })}
      activeOpacity={0.8}
    >
      {item.imagenUri && (
        <Image source={{ uri: item.imagenUri }} style={styles.thumbnail} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.nombreMed}>{item.nombre}</Text>
        <Text style={styles.detalle}>Dosis: {item.dosis}</Text>
        <Text style={styles.detalle}>Hora: {item.hora}</Text>
        {item.notas ? <Text style={styles.notas}>Nota: {item.notas}</Text> : null}
        {item.contacto && (
          <Text style={styles.contacto}>
            <Ionicons name="person-outline" size={12} color="#1e90ff" /> {item.contacto.nombre}
          </Text>
        )}
        {item.ubicacion && (
          <Text style={styles.ubicacion}>
            <Ionicons name="location-outline" size={12} color="#32CD32" /> {item.ubicacion.direccion || `${item.ubicacion.latitude.toFixed(4)}, ${item.ubicacion.longitude.toFixed(4)}`}
          </Text>
        )}
        {item.eventoCalendarioId && (
          <Text style={styles.calendario}>
            <Ionicons name="calendar-outline" size={12} color="#ff8c00" /> En calendario
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => handleEliminar(item.id, item.nombre)} style={styles.btnBorrar}>
        <Ionicons name="trash-outline" size={22} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {medications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No tenes medicamentos cargados</Text>
          <Text style={styles.emptySub}>Tocá el boton de abajo para agregar uno</Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <View style={styles.footer}>
        <Boton
          titulo="+ Agregar Medicación"
          onPress={() => navigation.navigate('AddMed')}
          color="#1e90ff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  nombreMed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  detalle: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  notas: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  contacto: {
    fontSize: 12,
    color: '#1e90ff',
    marginTop: 4,
  },
  ubicacion: {
    fontSize: 12,
    color: '#32CD32',
    marginTop: 2,
  },
  calendario: {
    fontSize: 12,
    color: '#ff8c00',
    marginTop: 2,
  },
  btnBorrar: {
    padding: 8,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
