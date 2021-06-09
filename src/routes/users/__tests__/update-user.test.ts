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
  url: "/v1/users/60b4fa10ded55343745e29d7",
  method: "put",
  middlewares: ["requireAuth"],
};

TestingService.use(config);

it("returns 404 if the account wasn't found", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .put("/v1/users/60b5972e408e6f2970045bee")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
});

it("returns 401 if a user is trying to update another user's account", async () => {
  const { user } = await TestingService.createUserAccount();
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
});

it("returns 200 if an admin is trying to update a user's account", async () => {
  const { user } = await TestingService.createUserAccount();
  const { token } = await TestingService.createAdminAccount();

  const requestBody = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  const response = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { success, user: responseUser } = response.body;

  expect(success).toBe(true);
  expect(responseUser.id).toBe(user.id);
});

it("returns 200 if a user is trying to update his own account", async () => {
  const { user, token } = await TestingService.createUserAccount();

  const requestBody = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  const response = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { success, user: responseUser } = response.body;

  expect(success).toBe(true);
  expect(responseUser.email).toBe(requestBody.email);
  expect(responseUser.firstName).toBe(requestBody.firstName);
  expect(responseUser.lastName).toBe(requestBody.lastName);
});

it("returns 200 if a user is trying to update his own account but changes nothing", async () => {
  const { user, token } = await TestingService.createUserAccount();
  const response = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send({})
    .expect(200);

  const { success, user: userResponse } = response.body;

  expect(success).toBe(true);
  expect(userResponse.email).toBe(user.email);
  expect(userResponse.firstName).toBe(user.firstName);
  expect(userResponse.lastName).toBe(user.lastName);
});

it("returns 400 if the email is already in use", async () => {
  const { user: existingUser } = await TestingService.createUserAccount();
  const { token, user } = await TestingService.createUserAccount();

  const requestBody = {
    email: existingUser.email,
  };

  const response = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.EmailInUse);
});

it("returns 400 if the provided inputs are not valid", async () => {
  const { token, user } = await TestingService.createUserAccount();

  const requestBody = {
    email: "asdasd",
    firstName: "",
    lastName: "",
  };

  const response = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(3);

  expect(errors[0].field).toBe("email");
  expect(errors[0].errorType).toBe(ErrorTypes.InputValidation);

  expect(errors[1].field).toBe("firstName");
  expect(errors[1].errorType).toBe(ErrorTypes.InputValidation);

  expect(errors[2].field).toBe("lastName");
  expect(errors[2].errorType).toBe(ErrorTypes.InputValidation);
});
