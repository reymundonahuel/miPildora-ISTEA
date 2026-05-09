# Guion de Usuario - MiPildora App

## Escena 1: Registro
**[PANTALLA: Splash → Registro]**

NARRADOR:
"Bienvenido a MiPildora, tu asistente personal para el cuidado de la salud."

**[El usuario toca "Crear cuenta"]**

NARRADOR:
"Completa tus datos: nombre, correo electrónico y una contraseña segura. También puedes registrarte rápidamente con tu cuenta de Google."

**[El usuario llena el formulario y presiona "Registrarme"]**

SISTEMA:
"Cuenta creada exitosamente."

---

## Escena 2: Inicio de Sesión
**[PANTALLA: Login]**

NARRADOR:
"¿Ya tenés cuenta? Ingresá tu correo y contraseña para continuar."

**[El usuario completa los campos y presiona "Iniciar sesión"]**

SISTEMA:
"Inicio de sesión exitoso."

**[TRANSICIÓN: Dashboard principal]**

---

## Escena 3: Cargar Medicación
**[PANTALLA: Dashboard → Botón "+ Agregar medicación"]**

NARRADOR:
"Desde tu panel principal, tocá el botón para agregar una nueva medicación."

**[El usuario toca el botón]**

**[PANTALLA: Formulario de medicación]**

NARRADOR:
"Completá los datos de tu tratamiento: nombre del medicamento, dosis, frecuencia y el horario en el que debés tomarlo."

**[El usuario llena los campos: nombre, dosis, cada 8 horas, horario 08:00]**

**[El usuario presiona "Guardar"]**

---

## Escena 4: Confirmación de Notificación
**[PANTALLA: Confirmación con ícono de campana]**

SISTEMA:
"¡Listo! Tu medicación fue cargada correctamente."

NARRADOR:
"Quedó agendada la notificación. MiPildora te avisará puntualmente cuando sea hora de tomar tu medicamento."

**[PANTALLA: Vista previa de la notificación agendada para las 08:00 hs]**

SISTEMA:
"Recordatorio programado para las 08:00."

---

## Escena 5: Finalización
**[PANTALLA: Dashboard con la nueva medicación listada]**

NARRADOR:
"Desde ahora, MiPildora cuida de vos. Podés editar, pausar o eliminar tus recordatorios cuando lo necesites."

**[PANTALLA: Fade out → Logo de MiPildora]**

SISTEMA:
"Gracias por usar MiPildora. Tu salud, en tus manos."

**[FIN]**

---

## Notas Técnicas
- Cada transición debe ser suave (300-500ms).
- Las notificaciones push deben solicitarse tras el registro exitoso.
- El recordatorio debe sincronizarse con el sistema operativo del dispositivo.
