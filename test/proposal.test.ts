import { api } from "./setup";
import { prismaMock } from "./singleton";
import verifyAdminAccess from "../src/middleware/admin";

//@ts-ignore
jest.mock("../src/middleware/admin", () => jest.fn((req, res, next) => next()));

describe("GET /governance/proposal/{txHash}/{certIndex}", () => {
  it("should respond with status 200", async () => {
    const proposal = {
      id: "1",
      post_id: "12345",
      tx_hash: "test_tx_hash",
      cert_index: "0",
      governance_type: "info_action",
      expiration: 200,
      metadata: "test_metadata",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.proposal.findUnique.mockResolvedValue(proposal);
    const response = await api.get(
      `/governance/proposal/${proposal.tx_hash}/${proposal.cert_index}`
    );

    expect(response.status).toBe(200);
  });
});

describe("POST /governance/proposal/{txHash}/{certIndex}", () => {
  it("should respond with status 200", async () => {
    const proposal = {
      id: "1",
      post_id: "12345",
      tx_hash: "test_tx_hash",
      cert_index: "0",
      governance_type: "info_action",
      expiration: 200,
      metadata: "test_metadata",
      stake_key_lovelace: 1000,
      created_at: new Date(),
      updated_at: new Date(),
    };

    prismaMock.proposal.create.mockResolvedValue(proposal);
    const response = await api
      .post(`/governance/proposal/${proposal.tx_hash}/${proposal.cert_index}`)
      .send(proposal);

    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});
