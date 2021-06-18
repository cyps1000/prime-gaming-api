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
  url: "/v1/users/60b4fa10ded55343745e29d7/change-password",
  method: "put",
  middlewares: ["requireAdminAuth", "validateRequest"],
  fields: [
    {
      name: "newPassword",
      getValue: faker.internet.password,
      validate: true,
    },
  ],
};

TestingService.use(config);

it("returns 200 if an admin is trying to change the password of a user", async () => {
  const { token } = await TestingService.createAdminAccount();
  const { user } = await TestingService.createUserAccount();

  const requestBody = {
    newPassword: faker.internet.password(),
  };

  const response = await request(server)
    .put(`/v1/users/${user.id}/change-password`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { success } = response.body;

  expect(success).toBe(true);
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await TestingService.createAdminAccount();

  const requestBody = {
    newPassword: faker.internet.password(),
  };

  const response = await request(server)
    .put("/v1/users/this_is_an_invalid_id/change-password")
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 404 if the user doesn't exist", async () => {
  const { token } = await TestingService.createAdminAccount();

  const requestBody = {
    newPassword: faker.internet.password(),
  };

  const response = await request(server)
    .put("/v1/users/60b4fa10ded55343745e29d7/change-password")
    .set("Authorization", token)
    .send(requestBody)
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
});
