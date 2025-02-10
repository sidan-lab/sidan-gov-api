import request from "supertest";
import server from "../src/server";

beforeAll((done) => {
  done();
});

afterAll((done) => {
  server.close();
  done();
});

// Export the supertest request function for use in tests
export const api = request(server);
