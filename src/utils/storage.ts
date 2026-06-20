import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@mipildora_user";
const MEDS_KEY = "@mipildora_meds";

export interface UserData {
  username: string;
  password: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  direccion?: string;
}

export interface ContactData {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
}

export interface Medication {
  id: string;
  nombre: string;
  dosis: string;
  hora: string;
  notas?: string;
  creadoEn: number;
  imagenUri?: string;
  ubicacion?: LocationData;
  contacto?: ContactData;
  eventoCalendarioId?: string;
}

export async function guardarUsuario(user: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.log("error guardando user", e);
  }
}

export async function traerUsuario(): Promise<UserData | null> {
  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.log("error trayendo user", e);
    return null;
  }
}

export async function guardarMeds(meds: Medication[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MEDS_KEY, JSON.stringify(meds));
  } catch (e) {
    console.log("fallo guardar meds", e);
  }
}

export async function traerMeds(): Promise<Medication[]> {
  try {
    const json = await AsyncStorage.getItem(MEDS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.log("fallo traer meds", e);
    return [];
  }
}

export async function agregarMed(med: Medication): Promise<void> {
  const meds = await traerMeds();
  meds.push(med);
  await guardarMeds(meds);
}

export async function eliminarMed(id: string): Promise<void> {
  const meds = await traerMeds();
  const filtradas = meds.filter((m) => m.id !== id);
  await guardarMeds(filtradas);
}

export async function actualizarMed(
  id: string,
  updates: Partial<Medication>,
): Promise<void> {
  const meds = await traerMeds();
  const index = meds.findIndex((m) => m.id === id);
  if (index !== -1) {
    meds[index] = { ...meds[index], ...updates };
    await guardarMeds(meds);
  }
}
