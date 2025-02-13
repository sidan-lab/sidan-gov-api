import { JsonWebTokenError } from "jsonwebtoken";
import { api } from "./setup";
import { prismaMock } from "./singleton";

const mockAdminAccessList = jest.fn();
const mockJwtVerify = jest.fn();
const mockCheckIfStaked = jest.fn();

const findUnique = jest.fn();

jest.mock("../src/data/admins.ts", () => ({
  get adminAccessList() {
    return mockAdminAccessList();
  },
}));

jest.mock("../src/libs/cardano.ts", () => ({
  checkIfStaked: () => mockCheckIfStaked(),
}));

jest.mock("../src/libs/jwt.ts", () => ({
  jwtVerify: () => mockJwtVerify(),
}));

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

const mockAdminUser = {
  ...mockUser,
  wallet_address: "addr_test_admin",
};
const mockUserWithNoJwt = {
  ...mockUser,
  jwt: "",
};

mockAdminAccessList.mockReturnValue([
  {
    wallet_address: "addr_test_admin",
  },
]);

describe("POST /user/verify", () => {
  it("should respond with status 200, normal user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    mockJwtVerify.mockImplementation(() => () => ({
      discord_id: "12345",
    }));

    mockCheckIfStaked.mockResolvedValue({
      isRegistered: true,
      isStaked: true,
      isDRepDelegated: true,
    });

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(200);
  });

  it("should respond with status 200, admin user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockAdminUser);

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(200);
  });

  it("should respond with status 401, not staked", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    mockJwtVerify.mockImplementation(() => () => ({
      discord_id: "12345",
    }));

    mockCheckIfStaked.mockResolvedValue({
      isRegistered: false,
      isStaked: false,
      isDRepDelegated: false,
    });

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(401);
  });

  it("should respond with status 401, no discord id", async () => {
    const response = await api.post("/user/verify");

    expect(response.status).toBe(401);
  });

  it("should respond with status 401, user not signed in", async () => {
    findUnique.mockResolvedValue(undefined);
    prismaMock.user.findUnique.mockImplementation(findUnique);

    const response = await api
      .post("/user/verify")
      .set({ "discord-id": "12345" });

    expect(response.status).toBe(401);
  });

  it("should respond with status 401, user without jwt", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUserWithNoJwt);

    mockJwtVerify.mockRejectedValue({} as JsonWebTokenError);

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
    prismaMock.user.findUnique.mockResolvedValue(mockAdminUser);

    const response = await api
      .post("/user/verify-admin")
      .set({ "discord-id": "12345" });
    expect(response.status).toBe(200);
  });

  it("should respond with status 401, normal user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockAdminUser);

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
