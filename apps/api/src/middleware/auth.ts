import { GetVerificationKey, expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const auth0Domain = process.env.AUTH0_DOMAIN;
if (!auth0Domain) {
  throw new Error("AUTH0_DOMAIN is required");
}

const audience = process.env.AUTH0_AUDIENCE;

export const auth = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `${auth0Domain.replace(/\/$/, "")}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience || undefined,
  issuer: `${auth0Domain.replace(/\/$/, "")}/`,
  algorithms: ["RS256"],
  credentialsRequired: true,
});
