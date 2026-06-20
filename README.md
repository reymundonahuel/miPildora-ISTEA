# MiPildora - Recordatorio de Medicación

App desarrollada para el parcial de Aplicaciones Móviles (ISTEA).

## Opción elegida

Recordatorio de medicación 💊

## Cómo ejecutar la app

1. Clonar el repo
2. `npm install`
3. `npx expo start`
4. Escanear el QR con Expo Go o usar un emulador

## Funcionalidades implementadas

### Parcial 1

- Registro de usuario (local con AsyncStorage)
- Login validando credenciales guardadas
- Pantalla principal con lista de medicamentos
- Agregar medicamentos con nombre, dosis, hora y notas
- Eliminar medicamentos de la lista
- Notificaciones locales programadas para la hora indicada
- Los datos se mantienen al cerrar la app
- Navegación con React Navigation (Stack)
- Componente reutilizable personalizado (Boton)

### Parcial 2

- **Estado global con Zustand**: Store centralizado para medicamentos con persistencia en AsyncStorage
- **Foto del medicamento**: Tomar foto con cámara o seleccionar de galería (expo-image-picker)
- **Ubicación GPS**: Guardar ubicación de la farmacia con coordenadas y dirección (expo-location)
- **Contactos**: Seleccionar médico o familiar de la agenda (expo-contacts)
- **Calendario**: Crear evento de recordatorio en el calendario nativo (expo-calendar)
- **Manejo de permisos**: Solicitud y manejo de estados (concedido/denegado/pendiente) para todos los recursos
- **Pantalla de detalle**: Ver todos los datos del medicamento con acciones (llamar, ver mapa)
- **Testing automatizado**: 3 tests con Jest (componente, lógica de negocio, store)

## Testing

Para ejecutar los tests:

```bash
npm test
```

Tests incluidos:

- `__tests__/components/Boton.test.tsx` - Renderizado del componente Boton
- `__tests__/utils/validation.test.ts` - Validación de formato de hora
- `__tests__/store/useMedStore.test.ts` - CRUD del store Zustand

### Generación de tests con IA

Los tests fueron generados asistidos por inteligencia artificial.

**Modelo y proveedor utilizados:**

- **IA:** Kimi K2.6
- **Plataforma/Proveedor:** Opencode Go

**Prompts utilizados:**

- **Boton.test.tsx:**

  > "A partir de este proyecto realiza los tests para el componente de boton."

- **validation.test.ts:**

  > "A partir de este proyecto realiza los tests para la funcion de validacion de hora y obligatorio."

- **useMedStore.test.ts:**
  > "A partir de este proyecto realiza los tests para la funcion de medStore."

## Tecnologías

- React Native
- Expo
- TypeScript
- AsyncStorage
- React Navigation
- expo-notifications
- **Zustand** (estado global)
- **expo-image-picker**
- **expo-location**
- **expo-contacts**
- **expo-calendar**
- **Jest** (testing)

## Estructura del proyecto

```
src/
├── store/
│   └── useMedStore.ts          # Store global con Zustand
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx          # Lista con Zustand
│   ├── AddMedScreen.tsx        # Formulario con recursos nativos
│   └── MedDetailScreen.tsx     # Detalle con acciones
├── components/
│   └── Boton.tsx               # Componente reutilizable
├── utils/
│   ├── storage.ts              # AsyncStorage + modelos
│   ├── notifications.ts        # Notificaciones locales
│   └── validation.ts           # Validaciones
__tests__/
├── components/
│   └── Boton.test.tsx
├── store/
│   └── useMedStore.test.ts
└── utils/
    └── validation.test.ts
```

## Video DEMO

[Link a YouTube](https://drive.google.com/file/d/1ZWzg5pP3ZultOoeWeEbvc5I8AEWpiYNe/view?usp=sharing) <!-- completar con el link real -->
