import { api } from "./setup";
import { prismaMock } from "./singleton";

//@ts-ignore
jest.mock("../src/middleware/auth", () => jest.fn((req, res, next) => next()));

//@ts-ignore
jest.mock("../src/middleware/admin", () => jest.fn((req, res, next) => next()));

import verifyUserAccess from "../src/middleware/auth";
import verifyAdminAccess from "../src/middleware/admin";

const mockUser = {
  id: "1",
  discord_id: "12345",
  is_staked_to_sidan: true,
  is_drep_delegated_to_sidan: true,
  wallet_address: "addr_test",
  jwt: "test_jwt",
  stake_key_lovelace: 1000,
  created_at: null,
  updated_at: null,
};

const mockSignIn = {
  discord_id: "12345",
  is_staked_to_sidan: true,
  is_drep_delegated_to_sidan: true,
  wallet_address: "addr_test",
  stake_key_lovelace: 10000000,
};

describe("GET /user", () => {
  it("should respond with status 200 with empty users", async () => {
    const response = await api.get("/user");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({ users: [] });
    expect(verifyAdminAccess).toHaveBeenCalled();
  });

  it("should respond with status 200 with users", async () => {
    const mockData = [
      {
        id: "1",
        discord_id: "12345",
        is_staked_to_sidan: true,
        is_drep_delegated_to_sidan: true,
        wallet_address: "addr_test",
        jwt: "",
        stake_key_lovelace: 1000,
        created_at: new Date("2025-02-17"),
        updated_at: new Date("2025-02-17"),
      },
      {
        id: "2",
        discord_id: "67890",
        is_staked_to_sidan: true,
        is_drep_delegated_to_sidan: true,
        wallet_address: "addr_test2",
        jwt: "",
        stake_key_lovelace: 1000,
        created_at: new Date("2025-02-17"),
        updated_at: new Date("2025-02-17"),
      },
    ];
    prismaMock.user.findMany.mockResolvedValue(mockData);

    const response = await api.get("/user");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      users: mockData.map((x) => {
        const { jwt, ...rest } = x;
        return {
          ...rest,
          created_at: x.created_at.toISOString(),
          updated_at: x.updated_at.toISOString(),
        };
      }),
    });
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});

describe("GET /user/{discordId}", () => {
  it("should respond with status 200", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const response = await api.get("/user/" + mockUser.discord_id);

    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });

  it("should respond with status 404, user not exist", async () => {
    const response = await api.get("/user/" + mockUser.discord_id);

    expect(response.status).toBe(404);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});

describe("POST /user/signIn", () => {
  it("should respond with status 200, new user", async () => {
    const response = await api.post("/user/signIn").send(mockSignIn);
    expect(response.status).toBe(200);
  });

  it("should respond with status 200, existing user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const response = await api.post("/user/signIn").send(mockSignIn);
    expect(response.status).toBe(200);
  });

  it("should respond with status 500, with no request body, new user", async () => {
    const response = await api.post("/user/signIn");
    expect(response.status).toBe(500);
  });

  it("should respond with status 500, with no request body, existing user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const response = await api.post("/user/signIn");
    expect(response.status).toBe(500);
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
