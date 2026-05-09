import Constants from 'expo-constants';
import { Platform } from 'react-native';

//esto es para que ande en expo go android sdk 53
/* ******************************************* */
const isExpoGoAndroid =
  Constants.executionEnvironment === 'storeClient' && Platform.OS === 'android';

let Notifications: typeof import('expo-notifications') | undefined;

if (!isExpoGoAndroid) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
}

/* ******************************************* */

// handler
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// pedir permisos
export async function pedirPermisosNotis(): Promise<boolean> {
  if (!Notifications) {
    console.log('expo-notifications no disponible en Expo Go Android (SDK 53+)');
    return false;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// schedulear notificacion para una hora especifica
export async function scheduleNotificacion(
  titulo: string,
  cuerpo: string,
  horaStr: string // "14:30"
): Promise<string | null> {
  if (!Notifications) {
    console.log('expo-notifications no disponible en Expo Go Android (SDK 53+)');
    return null;
  }

  const ok = await pedirPermisosNotis();
  if (!ok) {
    console.log('no hay permisos de notificacion');
    return null;
  }

  const [horaS, minS] = horaStr.split(':');
  const hora = parseInt(horaS, 10);
  const minuto = parseInt(minS, 10);

  const ahora = new Date();
  const fechaObjetivo = new Date();
  fechaObjetivo.setHours(hora, minuto, 0, 0);

  // si ya paso la hora, la programo para mañana
  if (fechaObjetivo.getTime() <= ahora.getTime()) {
    fechaObjetivo.setDate(fechaObjetivo.getDate() + 1);
  }

  const segundosHasta = Math.floor((fechaObjetivo.getTime() - ahora.getTime()) / 1000);

  const delay = Math.max(segundosHasta, 5);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delay,
    } as any, //este any es por un error que me causaba
  });

  return id;
}
