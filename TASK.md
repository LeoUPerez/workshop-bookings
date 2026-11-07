# Prueba técnica backend — Reservas de talleres

## Tu rol
Eres el ingeniero responsable de investigar un incidente de producción. Trabaja sin IA: puedes consultar documentación, usar un debugger, hacer búsquedas técnicas y escribir tus propias pruebas. No hay una solución incluida en este material.

Nivel: intermedio. Tiempo orientativo: 2–3 horas, sin contar la creación inicial de los archivos. Se evalúa el razonamiento y la evidencia, además del código.

## Ticket INC-024
**Prioridad: alta.**

Soporte recibe quejas de personas que llegaron a un taller con una reserva confirmada y no pudieron entrar porque ya no quedaban asientos. El organizador está teniendo que devolver dinero y reubicar clientes.

Los reportes aumentaron cuando una campaña promocional atrajo más tráfico. En las comprobaciones manuales habituales, el equipo puede crear reservas y recibe un rechazo cuando ya no hay cupo. Todavía no se ha documentado una reproducción confiable del incidente.

Tu trabajo es investigar el comportamiento del backend y entregar una corrección o workaround que respete las reglas del negocio. Debes justificar sus límites.

## Reglas de negocio
- Cada taller tiene una capacidad fija y comienza sin reservas.
- Una reserva solicita entre 1 y 5 asientos para un único taller.
- Una respuesta `201` promete al cliente que todos los asientos solicitados quedaron confirmados.
- Si no hay suficientes asientos, se responde `409` y no se crea una reserva ni se consume cupo.
- No se permiten confirmaciones parciales ni reservas pendientes.
- La suma de asientos confirmados no puede superar la capacidad.
- Los asientos disponibles deben coincidir con la capacidad menos los asientos confirmados.
- Dos solicitudes son operaciones independientes, aunque compartan correo. No hay restricción de una reserva por cliente.

## Alcance del entorno
La aplicación usa un solo proceso Node.js y un repositorio en memoria que representa operaciones de almacenamiento con latencia. Al reiniciar, se restauran los talleres iniciales y desaparecen las reservas. Esto es intencional.

No necesitas frontend, autenticación, pagos, Docker ni una base de datos real. El correo es un identificador de contacto: no se exige validación completa de direcciones. GET /bookings es una herramienta interna para este ejercicio.

Puedes modificar la organización del código y agregar archivos, pruebas o dependencias si lo justificas. Conserva los endpoints y sus formatos. No cambies capacidades, reglas del negocio ni la latencia simulada para hacer desaparecer el incidente. No reemplaces las operaciones del repositorio por almacenamiento síncrono. El comportamiento durante un reinicio o una caída del proceso queda fuera de alcance.

## Qué debes hacer
1. Crear el proyecto con los archivos del código base y ejecutarlo.
2. Comprobar el flujo normal y documentar qué observas.
3. Construir una reproducción repetible del incidente. Conserva solicitudes, respuestas y estado final como evidencia.
4. Explicar la causa raíz con tus propias palabras, apoyándote en el código y en la evidencia.
5. Implementar una corrección o workaround dentro del alcance indicado.
6. Agregar pruebas automatizadas que fallen con el comportamiento original y pasen con tu cambio.
7. Verificar que las validaciones y los casos normales siguen funcionando.
8. Escribir `SOLUTION.md` con los apartados indicados abajo.

## Criterios de aceptación
- Bajo demanda de distintos clientes, nunca se confirman más asientos que la capacidad del taller.
- Cada `201` corresponde a una reserva consultable con los asientos solicitados.
- Los rechazos por falta de cupo usan `409` y no consumen asientos.
- Al terminar las solicitudes, el inventario y las reservas coinciden.
- Un taller lleno no impide reservar otro con disponibilidad.
- Los cuerpos inválidos responden `400`; un taller inexistente responde `404`.
- La API continúa atendiendo solicitudes tras un rechazo.
- Las pruebas son repetibles y no dependen de revisar manualmente la consola.

## Entrega
Entrega el código completo, tus pruebas y `SOLUTION.md` con:
- Cómo ejecutar el proyecto y las pruebas.
- Pasos de reproducción del incidente original.
- Resultado esperado y resultado observado.
- Diagnóstico con evidencia.
- Cambios realizados y justificación.
- Evidencia de que tu cambio satisface los criterios.
- Limitaciones y qué reconsiderarías si la aplicación creciera a varias instancias.

No necesitas implementar soporte para varias instancias. Diferencia lo que comprobaste de lo que supones. Evita refactors ajenos al incidente.

## Contrato HTTP
| Método | Ruta | Respuesta correcta |
| --- | --- | --- |
| GET | /health | 200: `{ "status": "ok" }` |
| GET | /workshops | 200: array de talleres |
| GET | /bookings | 200: array de reservas |
| POST | /bookings | 201: reserva creada |

Taller: `{ "id": "ws-101", "title": "Introducción a cerámica", "capacity": 5, "availableSeats": 5 }`.

Reserva: `{ "id": "UUID", "workshopId": "ws-101", "customerEmail": "ana@example.com", "seats": 2, "status": "confirmed", "createdAt": "fecha ISO" }`.

Los errores usan `{ "error": "mensaje" }`. No se exige conservar el texto exacto.

## Puesta en marcha
Requiere Node.js 20 o superior y npm. No hay dependencias externas en el código inicial.

```bash
npm start
```

En otra terminal:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/workshops
curl -i -X POST http://localhost:3000/bookings \
  -H 'Content-Type: application/json' \
  -d '{"workshopId":"ws-101","customerEmail":"ana@example.com","seats":2}'
curl http://localhost:3000/bookings
```

Para volver al estado inicial, detén y reinicia el servidor. Puedes cambiar el puerto con `PORT=3001 npm start`. El comando `npm test` ejecutará las pruebas que agregues con el runner de Node.js; el proyecto inicial no incluye pruebas.
