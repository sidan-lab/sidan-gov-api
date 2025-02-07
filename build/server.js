"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app_1 = __importDefault(require("./app"));
const proposal_1 = __importDefault(require("./routes/governance/proposal"));
const vote_1 = __importDefault(require("./routes/governance/vote"));
const user_1 = __importDefault(require("./routes/user"));
const swaggerSpec = require("../swaggerConfig");
console.log("Setting up routes...");
app_1.default.use("/user", user_1.default);
app_1.default.use("/governance/proposal", proposal_1.default);
app_1.default.use("/governance/vote", vote_1.default);
app_1.default.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app_1.default.use((err, _req, res, _next) => {
    const statusCode = res.statusCode || 500;
    console.error(err.stack);
    res.status(statusCode).json({ error: err.message });
});
const port = parseInt(process.env.PORT || "3002");
const server = app_1.default.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map