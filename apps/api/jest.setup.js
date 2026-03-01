// Dummy Auth0 env for unit tests (no real auth in tests)
process.env.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "https://test.auth0.com";
process.env.AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "https://test-api";
