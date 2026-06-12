const request = require('supertest');
const app = require('../app');

let token;

beforeEach(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@test.com', password: '123456', role: 'client' });
  token = res.body.token;
});

describe('POST /api/dogs', () => {
  it('should create a dog', async () => {
    const res = await request(app)
      .post('/api/dogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Rex', breed: 'Labrador', size: 'large' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Rex');
    expect(res.body.owner).toBeDefined();
  });

  it('should not create a dog without token', async () => {
    const res = await request(app)
      .post('/api/dogs')
      .send({ name: 'Rex', breed: 'Labrador', size: 'large' });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/dogs/me', () => {
  it('should return dogs of the logged user', async () => {
    await request(app)
      .post('/api/dogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Rex', breed: 'Labrador', size: 'large' });

    const res = await request(app)
      .get('/api/dogs/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Rex');
  });
});