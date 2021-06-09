import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";
import { ErrorTypes } from "../../../services/error";

/**
 * Imports services
 */
import { TestingService, TestConfig } from "../../../services/testing";

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/auth/refresh-token",
  method: "get",
  middlewares: []
};

TestingService.use(config);

it("returns 401 if a refresh token is expired / not found", async () => {
  const expiredToken = TestingService.generateToken({
    expired: true
  });

  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", expiredToken)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.RefreshTokenExpired);
});

it("returns 400 if a malformed token is sent", async () => {
  const malformedToken = TestingService.generateToken({
    malformed: true
  });

  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", malformedToken)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.JsonWebTokenError);
});

it("returns 400 if an invalid token is sent", async () => {
  const invalidToken = TestingService.generateToken({
    invalid: true
  });

  const res = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", invalidToken)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.JsonWebTokenError);
});

it("returns 200 and a new access token", async () => {
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .get("/v1/auth/refresh-token")
    .set("Authorization", token)
    .send()
    .expect(200);

  const { accessToken } = response.body;

  expect(accessToken).toBeDefined();
  expect(accessToken.length).toBeGreaterThan(100);
});
