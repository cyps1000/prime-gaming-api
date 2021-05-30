import request from "supertest";
import { server } from "../../../server";

it("returns 200 and a new access token", async () => {
  /**
   * Makes the api calls
   */
  const response = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const refreshResponse = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", response.body.token)
    .send()
    .expect(200);

  expect(refreshResponse.body.accessToken).toBeDefined();
  expect(refreshResponse.body.accessToken.length).toBeGreaterThan(100);
});

it("returns 400 if no Authorization header is provided", async () => {
  const response = await request(server)
    .get("/v1/auth/refresh-token")
    .send()
    .expect(400);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].message).toBe(
    "The authorization header is required."
  );
  expect(response.body.errors[0].errorType).toBe("AuthorizationRequired");
  expect(response.body.errors.length).toBeGreaterThan(0);
});

it("returns 401 if a refresh token is expired / not found", async () => {
  const response = await request(server)
    .get("/v1/auth/refresh-token")
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjM5NTVmYjhhNTYwNTk4YzA5N2I0ZCIsInRrSWQiOiI2MGIzOTU1ZmI4YTU2MDU5OGMwOTdiNTAiLCJyZWZyZXNoVG9rZW4iOiI2MGIzOTU1ZmI4YTU2MDU5OGMwOTdiNGYiLCJpYXQiOjE2MjIzODE5MTksImV4cCI6MTYyMjM4MzcxOX0.BJXohAAaddzNwgJw61nDbDA-J9RCdt7nYAD_c53WhUY"
    )
    .send()
    .expect(401);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].errorType).toBe("RefreshTokenExpired");
  expect(response.body.errors[0].message).toBe("Refresh token has expired.");

  expect(response.body.errors.length).toBeGreaterThan(0);
});

it("returns 400 if a malformed token is sent", async () => {
  const response = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", "invalid")
    .send()
    .expect(400);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].errorType).toBe("JsonWebTokenError");
  expect(response.body.errors[0].message).toBe("jwt malformed");
  expect(response.body.errors.length).toBeGreaterThan(0);
});

it("returns 400 if an invalid token is sent", async () => {
  const response = await request(server)
    .get("/v1/auth/refresh-token")
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYWQyODg3Y2U0NmRhNDFmYzRkMTIzNiIsInRrSWQiOiI2MGIzNWY5NDgzM2JhYjRlNDQxZWFmYzgiLCJyZWZyZXNoVG9rZW4iOiI2MGIzNWY5NDgzM2JhYjRlNDQxZWFmYzkiLCJpYXQiOjE2MjIzNjgxNDksImV4cCI6MTYyMjM2OTk0OX0.gtCmL5nzLSIvVFuxU8oWwXA5VzKmPr95OmRziWIo_RY"
    )
    .send()
    .expect(400);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].errorType).toBe("JsonWebTokenError");
  expect(response.body.errors[0].message).toBe("invalid signature");
  expect(response.body.errors.length).toBeGreaterThan(0);
});

it("has a router handler listening to /auth/refresh-token for get requests", async () => {
  const response = await request(server).get("/v1/auth/refresh-token").send();
  expect(response.status).not.toEqual(404);
});
