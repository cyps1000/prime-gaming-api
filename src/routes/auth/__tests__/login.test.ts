import request from "supertest";
import faker from "faker";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Imports services
 */
import { TestingService, TestConfig } from "../../../services/testing";
import { ErrorTypes } from "../../../services/error";

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/auth/login",
  method: "post",
  middlewares: ["validateRequest"],
  fields: [
    {
      name: "email",
      getValue: faker.internet.email,
      validate: true
    },
    {
      name: "password",
      getValue: faker.internet.password,
      validate: true
    }
  ]
};

TestingService.execute(config);

it("returns 400 if the email is wrong", async () => {
  const { requestBody } = await TestingService.createUserAccount();

  const response = await request(server)
    .post("/v1/auth/login")
    .send({
      email: "wrong-email@test.com",
      password: requestBody.password
    })
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidCredentials);
});

it("returns 400 if the password is wrong", async () => {
  const { requestBody } = await TestingService.createUserAccount();

  const response = await request(server)
    .post("/v1/auth/login")
    .send({
      email: requestBody.email,
      password: "wrong-password"
    })
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidCredentials);
});

it("returns an access token upon logging in", async () => {
  const { requestBody } = await TestingService.createUserAccount();

  const response = await request(server)
    .post("/v1/auth/login")
    .send({
      email: requestBody.email,
      password: requestBody.password
    })
    .expect(200);

  const { token } = response.body;

  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(100);
});
