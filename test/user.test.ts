import { api } from "./setup";
import { prismaMock } from "./singleton";

//@ts-ignore
jest.mock("../src/middleware/auth", () => jest.fn((req, res, next) => next()));

//@ts-ignore
jest.mock("../src/middleware/admin", () => jest.fn((req, res, next) => next()));

import verifyUserAccess from "../src/middleware/auth";
import verifyAdminAccess from "../src/middleware/admin";

describe("GET /user", () => {
  it("should respond with status 200", async () => {
    const response = await api.get("/user");
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: "1",
        discord_id: "12345",
        is_staked_to_sidan: true,
        is_drep_delegated_to_sidan: true,
        wallet_address: "addr_test",
        jwt: "",
        stake_key_lovelace: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "2",
        discord_id: "67890",
        is_staked_to_sidan: true,
        is_drep_delegated_to_sidan: true,
        wallet_address: "addr_test2",
        jwt: "",
        stake_key_lovelace: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});

describe("GET /user/{discordId}", () => {
  it("should respond with status 200", async () => {
    const user = {
      id: "1",
      discord_id: "12345",
      is_staked_to_sidan: true,
      is_drep_delegated_to_sidan: true,
      wallet_address: "addr_test",
      jwt: "",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    const response = await api.get("/user/" + user.discord_id);

    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});

describe("POST /user/signIn", () => {
  it("should respond with status 200", async () => {
    const mockRequest = {
      body: {
        discordId: "12345",
        username: "test",
        email: "",
      },
    };

    const response = await api.post("/user/signIn");
    expect(response.status).toBe(200);
  });
});

describe("POST /user/verify", () => {
  it("should respond with status 200", async () => {
    const response = await api.post("/user/verify");
    expect(response.status).toBe(200);
    expect(verifyUserAccess).toHaveBeenCalled();
  });
});

describe("POST /user/verify-admin", () => {
  it("should respond with status 200", async () => {
    const response = await api.post("/user/verify-admin");
    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});
