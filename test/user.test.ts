import { api } from "./setup";
import { prismaMock } from "./singleton";

//@ts-ignore
jest.mock("../src/middleware/auth", () => jest.fn((req, res, next) => next()));

//@ts-ignore
jest.mock("../src/middleware/admin", () => jest.fn((req, res, next) => next()));

import verifyUserAccess from "../src/middleware/auth";
import verifyAdminAccess from "../src/middleware/admin";

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
    const mockBody = {
      discord_id: "12345",
      is_staked_to_sidan: true,
      is_drep_delegated_to_sidan: true,
      wallet_address: "addr_test",
      stake_key_lovelace: 10000000,
    };

    const response = await api.post("/user/signIn").send(mockBody);
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
