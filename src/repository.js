import { setTimeout as wait } from 'node:timers/promises';

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
  async saveWorkshop(workshop) {
    await wait(40);
    workshops.set(workshop.id, copy(workshop));
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
