const request = require('supertest');

const server = 'http://localhost:3000';

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('responds with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200);
      });
    });
  });

  describe('/metrics', () => {
    describe('/metrics', () => {
      describe('GET', () => {
        it('responds with status 200 and application/json content', () => {
          return request(server)
            .get('/metrics/metrics?promAddress=localhost:9090')
            .expect('Content-Type', /application\/json/)
            .expect(200);
        });

        it('responds with metrics object as json', async () => {
          const response = await request(server).get(
            '/metrics/metrics?promAddress=localhost:9090'
          );

          const metrics = {
            cpu: 0,
            bytesIn: 0,
            bytesOut: 0,
            ramUsage: 0,
            latency: 0,
            prodReqTotal: 0,
            prodMessInTotal: 0,
            consReqTot: 0,
            consFailReqTotal: 0,
          };
          expect(Object.keys(response.body)).toEqual(Object.keys(metrics));
        });

        it('responds with status 401 if promAddress not formatted correctly', async () => {
          const response = await request(server)
            .get('/metrics/metrics?promAddress=locahost:9090')
            .expect(401);

          expect(response.body).toEqual('Improper Prometheus Address');
        });

        it('responds with status 400 if could not connect to prometheus server', async () => {
          const response = await request(server)
            .get('/metrics/metrics?promAddress=localhost:8080')
            .expect(400);

          expect(response.body).toEqual('Could not get metrics');
        });
      });
    });
  });
});


