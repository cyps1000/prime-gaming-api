import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).get("/v1/auth/refresh-token").send();
  expect(res.status).not.toEqual(404);
});

it("returns 200 and a new access token", async () => {
  const res = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const { token } = res.body;

  const refreshRes = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", token)
    .send()
    .expect(200);

  const { accessToken } = refreshRes.body;

  expect(accessToken).toBeDefined();
  expect(accessToken.length).toBeGreaterThan(100);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 401 if a refresh token is expired / not found", async () => {
  /**
   * Defines the expired token
   */
  const expiredToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjM5NTVmYjhhNTYwNTk4YzA5N2I0ZCIsInRrSWQiOiI2MGIzOTU1ZmI4YTU2MDU5OGMwOTdiNTAiLCJyZWZyZXNoVG9rZW4iOiI2MGIzOTU1ZmI4YTU2MDU5OGMwOTdiNGYiLCJpYXQiOjE2MjIzODE5MTksImV4cCI6MTYyMjM4MzcxOX0.BJXohAAaddzNwgJw61nDbDA-J9RCdt7nYAD_c53WhUY";

  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", expiredToken)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("RefreshTokenExpired");
});

it("returns 400 if a malformed token is sent", async () => {
  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", "invalid")
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("JsonWebTokenError");
});

it("returns 400 if an invalid token is sent", async () => {
  /**
   * Defines the invalid token
   */
  const invalidToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYWQyODg3Y2U0NmRhNDFmYzRkMTIzNiIsInRrSWQiOiI2MGIzNWY5NDgzM2JhYjRlNDQxZWFmYzgiLCJyZWZyZXNoVG9rZW4iOiI2MGIzNWY5NDgzM2JhYjRlNDQxZWFmYzkiLCJpYXQiOjE2MjIzNjgxNDksImV4cCI6MTYyMjM2OTk0OX0.gtCmL5nzLSIvVFuxU8oWwXA5VzKmPr95OmRziWIo_RY";

  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", invalidToken)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("JsonWebTokenError");
});
