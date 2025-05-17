import { api } from "./setup";
import { prismaMock } from "./singleton";
import verifyAdminAccess from "../src/middleware/admin";
import { mock } from "node:test";

//@ts-ignore
jest.mock("../src/middleware/admin", () => jest.fn((req, res, next) => next()));

const mockProposal = {
  id: "1",
  post_id: "12345",
  tx_hash: "test_tx_hash",
  cert_index: "0",
  governance_type: "info_action",
  expiration: 200,
  metadata: "test_metadata",
  stake_key_lovelace: 1000,
  created_at: null,
  updated_at: null,
};

describe("GET /governance/proposal/{txHash}/{certIndex}", () => {
  it("should respond with status 200", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    const response = await api.get(
      `/governance/proposal/${mockProposal.tx_hash}/${mockProposal.cert_index}`
    );

    expect(response.status).toBe(200);
  });

  it("should respond with status 200, proposal not found", async () => {
    const response = await api.get(
      `/governance/proposal/${mockProposal.tx_hash}/${mockProposal.cert_index}`
    );

    expect(response.status).toBe(200);
    expect(response.body.proposal).toEqual(null);
  });
});

describe("POST /governance/proposal/{txHash}/{certIndex}", () => {
  it("should respond with status 200, creating proposal", async () => {
    prismaMock.proposal.create.mockResolvedValue(mockProposal);

    const response = await api
      .post(
        `/governance/proposal/${mockProposal.tx_hash}/${mockProposal.cert_index}`
      )
      .send(mockProposal);

    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });

  it("should respond with status 200, updating proposal", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.proposal.update.mockResolvedValue({ ...mockProposal, id: "2" });
    const response = await api
      .post(
        `/governance/proposal/${mockProposal.tx_hash}/${mockProposal.cert_index}`
      )
      .send(mockProposal);

    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });

  it("should respond with status 500, empty request body", async () => {
    const response = await api.post(
      `/governance/proposal/${mockProposal.tx_hash}/${mockProposal.cert_index}`
    );

    expect(response.status).toBe(500);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});
