import { randomUUID } from 'node:crypto';
import { repository } from './repository.js';
import { HttpError } from './errors.js';

export async function createBooking(input) {

  //validate if it is an object
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'Invalid request body');
  }

  //destructuring
  const { workshopId, customerEmail, seats } = input;

  // validate u send right values
  if (typeof workshopId !== 'string' || !workshopId.trim() ||
      typeof customerEmail !== 'string' || !customerEmail.trim() ||
      !Number.isSafeInteger(seats) || seats < 1 || seats > 5) {
    throw new HttpError(400, 'workshopId, customerEmail and seats (1-5) are required');
  }

  // Atomic check-and-reserve: no await inside, so no race condition is possible.
  // If the workshop doesn't exist or there aren't enough seats, this throws.
  repository.reserveSeats(workshopId, seats);

  // Seats are guaranteed at this point, create the booking record
  return repository.createBooking({
    id: randomUUID(),
    workshopId,
    customerEmail,
    seats,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  });
}
