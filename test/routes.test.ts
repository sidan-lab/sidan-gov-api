import { api } from "./setup";

describe("API Endpoints", () => {
  it("should respond with status 200 for GET /user", async () => {
    const response = await api.get("/user");
    expect(response.status).toBe(200);
  });
});
