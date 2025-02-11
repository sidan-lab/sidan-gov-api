import { api } from "./setup";
import { prismaMock } from "./singleton";

const mockAdminAccessList = jest.fn();

jest.mock("../src/data/admins.ts", () => ({
  get adminAccessList() {
    return mockAdminAccessList();
  },
}));

describe("POST /user/verify", () => {
  it("should respond with status 200, normal user", async () => {
    const user = {
      id: "1",
      discord_id: "12345",
      is_staked_to_sidan: true,
      is_drep_delegated_to_sidan: true,
      wallet_address: "addr_test",
      jwt: "test_jwt",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(200);
  });

  it("should respond with status 200, admin user", async () => {
    const user = {
      id: "1",
      discord_id: "12345",
      is_staked_to_sidan: true,
      is_drep_delegated_to_sidan: true,
      wallet_address: "addr_test",
      jwt: "test_jwt",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    mockAdminAccessList.mockReturnValue([
      {
        wallet_address: "addr_test",
      },
    ]);

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(200);
  });

  it("should respond with status 401, user not signed in", async () => {
    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(401);
  });

  it("should respond with status 401, user without jwt", async () => {
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

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(401);
  });

  it("should respond with status 401, no discord id", async () => {
    const response = await api.post("/user/verify");

    expect(response.status).toBe(401);
  });
});

describe("POST /user/verify-admin", () => {
  it("should respond with status 200, admin user", async () => {
    const user = {
      id: "1",
      discord_id: "12345",
      is_staked_to_sidan: true,
      is_drep_delegated_to_sidan: true,
      wallet_address: "addr_test",
      jwt: "test_jwt",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    mockAdminAccessList.mockReturnValue([
      {
        wallet_address: "addr_test",
      },
    ]);

    const response = await api
      .post("/user/verify-admin")
      .set({ "discord-id": "12345" });
    expect(response.status).toBe(200);
  });

  it("should respond with status 401, normal user", async () => {
    const user = {
      id: "1",
      discord_id: "12345",
      is_staked_to_sidan: true,
      is_drep_delegated_to_sidan: true,
      wallet_address: "addr_test",
      jwt: "test_jwt",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    mockAdminAccessList.mockReturnValue([
      {
        wallet_address: "addr_test_not_you",
      },
    ]);

    const response = await api
      .post("/user/verify-admin")
      .set({ "discord-id": "12345" });
    expect(response.status).toBe(401);
  });

  it("should respond with status 401, no discord id", async () => {
    const response = await api.post("/user/verify-admin");

    expect(response.status).toBe(401);
  });
});
