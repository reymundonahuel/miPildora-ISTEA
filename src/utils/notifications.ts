import Constants, { ExecutionEnvironment } from "expo-constants";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// NUNCA importar expo-notifications en Expo Go: SDK 53+ lo removio y crashea
const Notifications = isExpoGo ? null : require("expo-notifications");

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

export async function pedirPermisosNotis(): Promise<boolean> {
  if (isExpoGo || !Notifications) {
    console.log("Notificaciones deshabilitadas en Expo Go");
    return false;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleNotificacion(
  titulo: string,
  cuerpo: string,
  horaStr: string,
): Promise<string | null> {
  if (isExpoGo || !Notifications) {
    console.log("Notificaciones deshabilitadas en Expo Go");
    return null;
  }

  const ok = await pedirPermisosNotis();
  if (!ok) {
    console.log("no hay permisos de notificacion");
    return null;
  }

  const [horaS, minS] = horaStr.split(":");
  const hora = parseInt(horaS, 10);
  const minuto = parseInt(minS, 10);

  const ahora = new Date();
  const fechaObjetivo = new Date();
  fechaObjetivo.setHours(hora, minuto, 0, 0);

  if (fechaObjetivo.getTime() <= ahora.getTime()) {
    fechaObjetivo.setDate(fechaObjetivo.getDate() + 1);
  }

  const segundosHasta = Math.floor(
    (fechaObjetivo.getTime() - ahora.getTime()) / 1000,
  );
  const delay = Math.max(segundosHasta, 5);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delay,
    } as any,
  });

  return id;
}
