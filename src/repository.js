import { setTimeout as wait } from 'node:timers/promises';
import { HttpError } from './errors.js';

const workshops = new Map([
  ['ws-101', { id: 'ws-101', title: 'Introducción a cerámica', capacity: 5, availableSeats: 5 }],
  ['ws-102', { id: 'ws-102', title: 'Fotografía urbana', capacity: 12, availableSeats: 12 }],
]);
const bookings = new Map();
const copy = value => value ? structuredClone(value) : null;

export const repository = {
  async listWorkshops() {
    await wait(15);
    return [...workshops.values()].map(copy);
  },
  async findWorkshop(id) {
    await wait(30);
    return copy(workshops.get(id));
  },
  // Atomic: read + check + write without any await in between.
  // Node is single-threaded — no other request can interleave during
  // synchronous code, so there is no window for a race condition here.
  reserveSeats(workshopId, seats) {
    const workshop = workshops.get(workshopId);
    if (!workshop) throw new HttpError(404, 'Workshop not found');
    if (workshop.availableSeats < seats) throw new HttpError(409, 'Not enough seats');
    workshop.availableSeats -= seats;
    return copy(workshop);
  },
  async createBooking(booking) {
    await wait(20);
    bookings.set(booking.id, copy(booking));
    return copy(booking);
  },
  async listBookings() {
    await wait(15);
    return [...bookings.values()].map(copy);
  },
};
