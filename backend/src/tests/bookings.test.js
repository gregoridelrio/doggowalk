const request = require('supertest');
const app = require('../app');

let clientToken, walkerToken, dogId, walkerId;

beforeEach(async () => {
  const walkerRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Walker Test', email: 'walker@test.com', password: '123456', role: 'walker' });
  walkerToken = walkerRes.body.token;
  walkerId = walkerRes.body.user.id;

  await request(app)
    .put('/api/walkers/profile')
    .set('Authorization', `Bearer ${walkerToken}`)
    .send({ pricePerWalk: 15, availableDays: ['2026-06-15', '2026-06-16'] });

  const clientRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Client Test', email: 'client@test.com', password: '123456', role: 'client' });
  clientToken = clientRes.body.token;

  const dogRes = await request(app)
    .post('/api/dogs')
    .set('Authorization', `Bearer ${clientToken}`)
    .send({ name: 'Rex', breed: 'Labrador', size: 'large' });
  dogId = dogRes.body._id;
});

describe('POST /api/bookings', () => {
  it('should create a booking on an available date', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ walkerId, dogId, date: '2026-06-15' });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('active');
    expect(res.body.walker).toBe(walkerId);
  });

  it('should not create a booking on unavailable date', async () => {
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ walkerId, dogId, date: '2026-06-15' });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ walkerId, dogId, date: '2026-06-15' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Walker not available on this date');
  });
});

describe('GET /api/bookings/me', () => {
  it('should return bookings of the logged client', async () => {
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ walkerId, dogId, date: '2026-06-15' });

    const res = await request(app)
      .get('/api/bookings/me')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe('active');
  });
});

describe('PATCH /api/bookings/:id/cancel', () => {
  it('should cancel a booking', async () => {
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ walkerId, dogId, date: '2026-06-15' });

    const res = await request(app)
      .patch(`/api/bookings/${bookingRes.body._id}/cancel`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });

  it('should not cancel a booking from another user', async () => {
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ walkerId, dogId, date: '2026-06-15' });

    const res = await request(app)
      .patch(`/api/bookings/${bookingRes.body._id}/cancel`)
      .set('Authorization', `Bearer ${walkerToken}`);

    expect(res.statusCode).toBe(403);
  });
});