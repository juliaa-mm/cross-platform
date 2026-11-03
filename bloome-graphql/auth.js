import jwt from "jsonwebtoken";
import { users } from "./data.js";

export const JWT_SECRET = "bloome-secret-key";

export function createToken(user) {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
}

export function getUserFromToken(token) {
    if (!token) {
        return null;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return users.find((user) => user.id === payload.userId) || null;
    } catch (error) {
        return null;
    }
}

export function getUserFromAuthHeader(authHeader) {
    if (!authHeader) {
        return null;
    }
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer") {
        return null;
    }
    return getUserFromToken(token);
}
