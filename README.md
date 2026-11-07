# Workshop Bookings API

API backend para gestionar reservas de asientos en talleres presenciales.

Este proyecto es una prueba práctica de ingeniería de software. Recibes una aplicación existente con un incidente reportado por usuarios y debes investigarlo y resolverlo por tu cuenta.

## Contexto del producto

Una empresa organiza talleres con cupos limitados. Los clientes consultan la disponibilidad y reservan uno o varios asientos.

Cuando la API confirma una reserva, el cliente entiende que sus asientos están garantizados. Los organizadores utilizan estas reservas para controlar la entrada y planificar los talleres.

## Incidente reportado

Algunos clientes llegan con una reserva confirmada y descubren que no quedan asientos. Esto provoca reclamos, devoluciones y trabajo adicional para los organizadores.

Los reportes aumentaron después de una campaña promocional. Las verificaciones manuales habituales no han permitido documentar una reproducción confiable.

Tu responsabilidad es investigar qué ocurre, reunir evidencia y corregir el comportamiento.

## Stack

- Node.js 20 o superior.
- JavaScript con módulos ES.
- Servidor HTTP nativo de Node.js.
- Repositorio en memoria con latencia simulada.
- Runner de pruebas nativo de Node.js.

El código inicial no requiere dependencias externas.

## Estructura

```text
workshop-bookings/
├── README.md
├── TASK.md
├── package.json
├── .gitignore
└── src/
    ├── server.js
    ├── booking-service.js
    ├── repository.js
    └── errors.js
```

| Archivo | Responsabilidad |
| --- | --- |
| `src/server.js` | Recibir solicitudes HTTP y devolver respuestas. |
| `src/booking-service.js` | Validar solicitudes y ejecutar la creación de reservas. |
| `src/repository.js` | Consultar y guardar talleres y reservas. |
| `src/errors.js` | Representar errores con un código HTTP. |
| `TASK.md` | Definir requisitos, restricciones y criterios de aceptación. |

## Ejecutar

Desde la carpeta del proyecto:

```bash
npm start
```

La API estará disponible en `http://localhost:3000`.

Para reiniciar automáticamente al modificar archivos:

```bash
npm run dev
```

Para usar otro puerto en macOS o Linux:

```bash
PORT=3001 npm start
```

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Comprobar que la API está disponible. |
| GET | `/workshops` | Consultar talleres y disponibilidad. |
| GET | `/bookings` | Consultar las reservas registradas. |
| POST | `/bookings` | Solicitar una reserva. |

### Ejemplo de reserva

```bash
curl -i -X POST http://localhost:3000/bookings \
  -H 'Content-Type: application/json' \
  -d '{"workshopId":"ws-101","customerEmail":"ana@example.com","seats":2}'
```

Una reserva confirmada devuelve `201`.

Los errores usan el siguiente formato:

```json
{
  "error": "Descripción del error"
}
```

## Datos iniciales

| ID | Taller | Capacidad |
| --- | --- | --- |
| `ws-101` | Introducción a cerámica | 5 |
| `ws-102` | Fotografía urbana | 12 |

Los datos viven en memoria. Reiniciar el servidor elimina las reservas y restablece la disponibilidad inicial.

## Tu objetivo

Investiga el incidente, construye una reproducción repetible e implementa una corrección o workaround que cumpla las reglas del negocio.

Antes de modificar el código, lee `TASK.md`: contiene los requisitos completos y las restricciones del ejercicio.

Trabaja sin inteligencia artificial. Puedes consultar documentación, utilizar un debugger y escribir tus propias herramientas de diagnóstico y pruebas.

## Pruebas

```bash
npm test
```

El proyecto inicial no incluye pruebas. Debes agregarlas como parte de tu trabajo.

## Entrega

Entrega:

- El código modificado.
- Las pruebas automatizadas.
- Un archivo `SOLUTION.md` con el diagnóstico, la evidencia, la justificación de los cambios y sus limitaciones.

Los apartados requeridos y los criterios de aceptación están definidos en `TASK.md`.