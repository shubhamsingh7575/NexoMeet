import crypto from "crypto";

const secret = process.env.JWT_SECRET || "nexomeet-development-secret";
const revokedTokens = new Set();

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const sign = (value) => crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("base64url");

export const createToken = (user) => {
    const header = encode({ alg: "HS256", typ: "JWT" });
    const payload = encode({
        sub: user._id.toString(),
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    });

    return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
};

const verifyToken = (token) => {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const expected = sign(`${header}.${payload}`);
    const signaturesMatch = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
    );

    if (!signaturesMatch) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;

    return decoded;
};

export const authenticate = (req, res, next) => {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        if (revokedTokens.has(token)) {
            return res.status(401).json({ message: "Token has been revoked" });
        }
        const user = verifyToken(token);
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = user;
        req.token = token;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const revokeToken = (token) => {
    if (!token) return;
    revokedTokens.add(token);
    setTimeout(() => revokedTokens.delete(token), 7 * 24 * 60 * 60 * 1000).unref?.();
};
