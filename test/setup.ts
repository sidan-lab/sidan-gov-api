import supertest from "supertest";
import server from "../src/server";

beforeAll(() => {});

afterAll((done) => {
  server.close();
  done();
});

// Export the supertest request function for use in tests
export const api = supertest(server);
