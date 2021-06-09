import request from "supertest";

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
  url: "/v1/users/60b4fa10ded55343745e29d7",
  method: "delete",
  middlewares: ["requireAuth"],
};

TestingService.use(config);

it("returns 404 if trying to delete a user that doesn't exist", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .delete("/v1/users/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await TestingService.createAdminAccount();

  const res = await request(server)
    .delete("/v1/users/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 200 when an admin deletes a user", async () => {
  const { token } = await TestingService.createAdminAccount();
  const { user } = await TestingService.createUserAccount();

  const response = await request(server)
    .delete(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, user: responseUser } = response.body;

  expect(success).toBe(true);
  expect(responseUser.id).toBe(user.id);
});

it("returns 401 when a user tries to delete an account that he doesn't own", async () => {
  const { user } = await TestingService.createUserAccount();
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .delete(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
});

it("returns 400 when a user tries to delete his account, but it's not suspended", async () => {
  const { user, token } = await TestingService.createUserAccount();

  const response = await request(server)
    .delete(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotSuspendedAccount);
});
