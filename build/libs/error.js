"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingEnvError = exports.paramValidationError = void 0;
const paramValidationError = (res, message) => {
    res.status(422).json({ error: message || "Unprocessable entity" });
};
exports.paramValidationError = paramValidationError;
const missingEnvError = (res, message) => {
    res.status(500).json({ error: message || "Missing environment variable" });
};
exports.missingEnvError = missingEnvError;
//# sourceMappingURL=error.js.map