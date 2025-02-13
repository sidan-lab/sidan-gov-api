import { api } from "./setup";
import { prismaMock } from "./singleton";
import verifyUserAccess from "../src/middleware/auth";
import verifyAdminAccess from "../src/middleware/admin";
import { VoteType } from "@prisma/client";

//@ts-ignore
jest.mock("../src/middleware/auth", () => jest.fn((req, res, next) => next()));
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

const mockUser = {
  id: "1",
  discord_id: "12345",
  is_staked_to_sidan: true,
  is_drep_delegated_to_sidan: true,
  wallet_address: "addr_test",
  jwt: "",
  stake_key_lovelace: 1000,
  created_at: null,
  updated_at: null,
};

const mockVote = {
  user_id: "1",
  proposal_id: "1",
  vote: "YES" as VoteType,
  created_at: null,
  updated_at: null,
};

const voteYes = {
  vote: "YES",
};

const voteNo = {
  vote: "NO",
};

const voteAbstain = {
  vote: "ABSTAIN",
};

const voteEmpty = {
  vote: "",
};

const voteUnexpected = {
  vote: "TEST",
};

const groupBy = jest.fn();

describe("GET /governance/vote/{postId}", () => {
  it("should respond with status 200", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    groupBy.mockResolvedValue([
      {
        _count: {
          vote: 1,
        },
        vote: "YES",
      },
      { _count: { vote: 1 }, vote: "NO" },
      { _count: { vote: 1 }, vote: "ABSTAIN" },
    ]);
    prismaMock.vote.groupBy.mockImplementation(groupBy);

    const response = await api
      .get(`/governance/vote/${mockProposal.post_id}`)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(200);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });

  it("should respond with status 500, proposal with non_existent_post_id", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .get(`/governance/vote/${"non_existent_post_id"}`)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(404);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });

  it("should respond with status 500, proposal with empty param", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .get(`/governance/vote/${""}`)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(404);
    expect(verifyAdminAccess).toHaveBeenCalled();
  });
});

describe("POST /governance/vote/{postId}", () => {
  it("should respond with status 200, voting YES, creating vote", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .post(`/governance/vote/${mockProposal.post_id}`)
      .send(voteYes)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(200);
    expect(verifyUserAccess).toHaveBeenCalled();
  });

  it("should respond with status 200, voting YES, updating vote", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.vote.findUnique.mockResolvedValue(mockVote);

    const response = await api
      .post(`/governance/vote/${mockProposal.post_id}`)
      .send(voteYes)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(200);
    expect(verifyUserAccess).toHaveBeenCalled();
  });

  it("should respond with status 200, voting NO", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .post(`/governance/vote/${mockProposal.post_id}`)
      .send(voteNo)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(200);
    expect(verifyUserAccess).toHaveBeenCalled();
  });

  it("should respond with status 200, voting ABSTAIN", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .post(`/governance/vote/${mockProposal.post_id}`)
      .send(voteAbstain)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(200);
    expect(verifyUserAccess).toHaveBeenCalled();
  });

  it("should respond with status 500, vote empty", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .post(`/governance/vote/${mockProposal.post_id}`)
      .send(voteEmpty)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(500);
    expect(verifyUserAccess).toHaveBeenCalled();
  });

  it("should respond with status 500, vote not expected", async () => {
    prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await api
      .post(`/governance/vote/${mockProposal.post_id}`)
      .send(voteUnexpected)
      .set("discord-id", mockUser.discord_id);

    expect(response.status).toBe(500);
    expect(verifyUserAccess).toHaveBeenCalled();
  });
});
