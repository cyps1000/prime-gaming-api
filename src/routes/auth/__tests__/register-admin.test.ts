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
  url: "/v1/auth/register-admin",
  method: "post",
  middlewares: ["validateRequest"],
  fields: [
    {
      name: "username",
      getValue: faker.internet.userName,
      validate: true
    },
    {
      name: "password",
      getValue: () => "Da2xVHtnPjB1l6!",
      validate: true
    }
  ]
};

TestingService.execute(config);

it("returns 400 if an account exists", async () => {
  const { requestBody } = await TestingService.createAdminAccount();

  const response = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: requestBody.username,
      password: requestBody.password
    })
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AdminExists);
});

it("creates an admin if no admin exists", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!"
    })
    .expect(201);
});

it("returns an access token upon creation", async () => {
  const { user, token, requestBody } =
    await TestingService.createAdminAccount();

  expect(user.username).toBe(requestBody.username);
  expect(user.role).toBe("prime-admin");
  expect(token.length).toBeGreaterThan(100);
});
