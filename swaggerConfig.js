const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Discord Bot API",
      version: "1.0.0",
      description: "API documentation for SIDAN Lab Discord bot",
    },
    servers: [
      {
        url: "http://localhost:3002",
      },
    ],
    components: {
      schemas: {
        ArrayOfUsers: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message",
            },
            users: {
              type: "array",
              description: "User array",
            },
          },
        },
        SingleUser: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message",
            },
            username: {
              type: "string",
              description: "User name",
            },
          },
        },
        UserCreateDto: {
          type: "object",
          properties: {
            discord_id: {
              type: "string",
              description: "Discord ID",
            },
            is_staked_to_sidan: {
              type: "boolean",
              description: "Whether the user is staked to SIDAN",
            },
            is_drep_delegated_to_sidan: {
              type: "boolean",
              description: "Whether the user's DRep is delegated to SIDAN",
            },
            wallet_address: {
              type: "string",
              description: "Wallet address",
            },
            stake_key_lovelace: {
              type: "number",
              description: "Stake key lovelace",
            },
          },
        },
        SingleProposal: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message",
            },
            proposal: {
              type: "object",
              description: "Proposal object",
            },
          },
        },
        ProposalCreateOrUpdateDto: {
          type: "object",
          properties: {
            post_id: {
              type: "string",
              description: "Post ID",
            },
            tx_hash: {
              type: "string",
              description: "Transaction hash",
            },
            cert_index: {
              type: "string",
              description: "Certificate index",
            },
            governance_type: {
              type: "string",
              description: "Governance type",
            },
            expiration: {
              type: "string",
              description: "Expiration",
            },
            metadata: {
              type: "string",
              description: "Proposal Metadata",
            },
          },
        },
        VoteDto: {
          type: "object",
          properties: {
            vote: {
              type: "string",
              description: "Vote",
            },
          },
        },
        VoteCount: {
          type: "object",
          properties: {
            yes: {
              type: "number",
              description: "Yes votes",
            },
            no: {
              type: "number",
              description: "No votes",
            },
            abstain: {
              type: "number",
              description: "Abstain votes",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/**/*.ts"], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
