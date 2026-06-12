const request = require('supertest');
const app = require('../app');

let token;

beforeEach(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Walker Test', email: 'walker@test.com', password: '123456', role: 'walker' });
  token = res.body.token;
});

describe('PUT /api/walkers/profile', () => {
  it('should create a walker profile', async () => {
    const res = await request(app)
      .put('/api/walkers/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ pricePerWalk: 15, availableDays: ['2026-06-15', '2026-06-16'] });

    expect(res.statusCode).toBe(200);
    expect(res.body.pricePerWalk).toBe(15);
    expect(res.body.availableDays).toHaveLength(2);
  });

  it('should not create a profile without token', async () => {
    const res = await request(app)
      .put('/api/walkers/profile')
      .send({ pricePerWalk: 15, availableDays: ['2026-06-15'] });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/walkers', () => {
  it('should return all walkers', async () => {
    await request(app)
      .put('/api/walkers/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ pricePerWalk: 15, availableDays: ['2026-06-15'] });

    const res = await request(app).get('/api/walkers');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].pricePerWalk).toBe(15);
  });
});