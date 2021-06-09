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
  url: "/v1/users/60b4fa10ded55343745e29d7/recover",
  method: "put",
  middlewares: ["requireAuth"],
};

TestingService.use(config);

it("returns 404 if the account wasn't found", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .put("/v1/users/60b5972e408e6f2970045bee/recover")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
});

it("returns 401 if a user is trying to recover another user's account", async () => {
  const { user } = await TestingService.createUserAccount();
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .put(`/v1/users/${user.id}/recover`)
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
});

it("returns 200 if an admin is trying to recover an account", async () => {
  const { token } = await TestingService.createAdminAccount();
  const { user } = await TestingService.createUserAccount();

  const response = await request(server)
    .put(`/v1/users/${user.id}/recover`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, user: responseUser } = response.body;

  expect(success).toBe(true);
  expect(responseUser.suspended).toBe(false);
});

it("returns 200 if a user is trying to recover his own account", async () => {
  const { token, user } = await TestingService.createUserAccount();

  const response = await request(server)
    .put(`/v1/users/${user.id}/recover`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, user: responseUser } = response.body;

  expect(success).toBe(true);
  expect(responseUser.suspended).toBe(false);
});
