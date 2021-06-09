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
  method: "get",
  middlewares: ["requireAdminAuth"],
};

TestingService.use(config);

it("returns 404 if trying to get a user that doesn't exist", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .get("/v1/users/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .get("/v1/users/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 200 and the user on a successful request", async () => {
  const { token } = await TestingService.createAdminAccount();
  const { user } = await TestingService.createUserAccount();

  const resonse = await request(server)
    .get(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(resonse.body.email).toBe(user.email);
  expect(resonse.body.firstName).toBe(user.firstName);
  expect(resonse.body.lastName).toBe(user.lastName);
});

it("returns 401 if the request is not made by an admin", async () => {
  const { user } = await TestingService.createUserAccount();
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .get(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = response.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
  expect(errors.length).toBeGreaterThan(0);
});
