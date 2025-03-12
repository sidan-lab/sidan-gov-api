import jwt from "jsonwebtoken";

/**
 * Verify JWT token
 *
 * @param {String} token - JWT token
 * @param {String} secret - JWT secret
 * @return {Object} decoded - Decoded JWT object
 */
export async function jwtVerify(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}
