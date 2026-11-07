import { createServer } from 'node:http';
import { repository } from './repository.js';
import { createBooking } from './booking-service.js';
import { HttpError } from './errors.js';

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let text = '';
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 16_384) throw new HttpError(413, 'Body too large');
    text += chunk.toString();
  }
  try { return JSON.parse(text); }
  catch { throw new HttpError(400, 'Invalid JSON'); }
}

const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && path === '/health') {
      return send(res, 200, { status: 'ok' });
    }
    if (req.method === 'GET' && path === '/workshops') {
      return send(res, 200, await repository.listWorkshops());
    }
    if (req.method === 'GET' && path === '/bookings') {
      return send(res, 200, await repository.listBookings());
    }
    if (req.method === 'POST' && path === '/bookings') {
      return send(res, 201, await createBooking(await readBody(req)));
    }
    send(res, 404, { error: 'Route not found' });
  } catch (error) {
    console.error(error);
    send(res, error instanceof HttpError ? error.status : 500, {
      error: error instanceof HttpError ? error.message : 'Internal server error',
    });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '127.0.0.1', () => console.log(`API: http://localhost:${port}`));
