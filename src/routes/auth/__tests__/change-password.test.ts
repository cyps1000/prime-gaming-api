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
  url: "/v1/auth/change-password",
  method: "put",
  middlewares: ["requireAuth", "validateRequest"],
  fields: [
    {
      name: "currentPassword",
      getValue: faker.internet.password,
      validate: true,
    },
    {
      name: "newPassword",
      getValue: faker.internet.password,
      validate: true,
    },
  ],
};

TestingService.use(config);

it("returns 404 if an admin is trying to change the password", async () => {
  const { token } = await TestingService.createAdminAccount();

  const requestBody = {
    currentPassword: faker.internet.password(),
    newPassword: faker.internet.password(),
  };

  const response = await request(server)
    .put("/v1/auth/change-password")
    .set("Authorization", token)
    .send(requestBody)
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
});

it("returns 200 if a user is trying to update his own account", async () => {
  const { token, requestBody: originalRequestBody } =
    await TestingService.createUserAccount();

  const requestBody = {
    currentPassword: originalRequestBody.password,
    newPassword: faker.internet.password(),
  };

  const response = await request(server)
    .put("/v1/auth/change-password")
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { success, user: responseUser } = response.body;

  expect(success).toBe(true);
  expect(responseUser.email).toBe(originalRequestBody.email);
});

it("returns 400 if the provided inputs are not valid", async () => {
  const { token } = await TestingService.createUserAccount();

  const requestBody = {
    currentPassword: faker.internet.password(),
    newPassword: faker.internet.password(),
  };

  const response = await request(server)
    .put("/v1/auth/change-password")
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidCredentials);
});
