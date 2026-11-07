import { randomUUID } from 'node:crypto';
import { repository } from './repository.js';
import { HttpError } from './errors.js';

export async function createBooking(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'Invalid request body');
  }
  const { workshopId, customerEmail, seats } = input;
  if (typeof workshopId !== 'string' || !workshopId.trim() ||
      typeof customerEmail !== 'string' || !customerEmail.trim() ||
      !Number.isSafeInteger(seats) || seats < 1 || seats > 5) {
    throw new HttpError(400, 'workshopId, customerEmail and seats (1-5) are required');
  }

  const workshop = await repository.findWorkshop(workshopId);
  if (!workshop) throw new HttpError(404, 'Workshop not found');
  if (workshop.availableSeats < seats) {
    throw new HttpError(409, 'Not enough seats');
  }

  workshop.availableSeats -= seats;
  await repository.saveWorkshop(workshop);
  return repository.createBooking({
    id: randomUUID(), workshopId, customerEmail, seats,
    status: 'confirmed', createdAt: new Date().toISOString(),
  });
}
