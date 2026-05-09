import AsyncStorage from '@react-native-async-storage/async-storage';

// constantes para las keys
const USER_KEY = '@mipildora_user';
const MEDS_KEY = '@mipildora_meds';

// tipo del user
export interface UserData {
  username: string;
  password: string;
}

// tipo de la medicacion
export interface Medication {
  id: string;
  nombre: string;
  dosis: string;
  hora: string; // HH:mm
  notas?: string;
  creadoEn: number;
}

// guardar usuario
export async function guardarUsuario(user: UserData): Promise<void> {
  try {
    const json = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, json);
  } catch (e) {
    console.log('error guardando user', e);
  }
}

// traer usuario
export async function traerUsuario(): Promise<UserData | null> {
  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.log('error trayendo user', e);
    return null;
  }
}

// guardar medicinas
export async function guardarMeds(meds: Medication[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MEDS_KEY, JSON.stringify(meds));
  } catch (e) {
    console.log('fallo guardar meds', e);
  }
}

// traer medicinas
export async function traerMeds(): Promise<Medication[]> {
  try {
    const json = await AsyncStorage.getItem(MEDS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.log('fallo traer meds', e);
    return [];
  }
}

// agregar una sola medicina
export async function agregarMed(med: Medication): Promise<void> {
  const meds = await traerMeds();
  meds.push(med);
  await guardarMeds(meds);
}

// eliminar medicina por id
export async function eliminarMed(id: string): Promise<void> {
  const meds = await traerMeds();
  const filtradas = meds.filter((m) => m.id !== id);
  await guardarMeds(filtradas);
}
