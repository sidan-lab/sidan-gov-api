import { api } from "./setup";
import { prismaMock } from "./singleton";
import verifyUserAccess from "../src/middleware/auth";

//@ts-ignore
jest.mock("../src/middleware/auth", () => jest.fn((req, res, next) => next()));

describe("POST /governance/vote/{postId}", () => {
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

    const vote = {
      vote: "YES",
    };

    prismaMock.proposal.findUnique.mockResolvedValue(proposal);
    prismaMock.user.findUnique.mockResolvedValue(user);
    const response = await api
      .post(`/governance/vote/${proposal.post_id}`)
      .send(vote)
      .set("discord-id", user.discord_id);

    expect(response.status).toBe(200);
    expect(verifyUserAccess).toHaveBeenCalled();
  });
});
