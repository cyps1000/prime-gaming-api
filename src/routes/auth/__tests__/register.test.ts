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

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/auth/register",
  method: "post",
  middlewares: ["validateRequest"],
  fields: [
    {
      name: "email",
      getValue: faker.internet.email,
      validate: true
    },
    {
      name: "firstName",
      getValue: faker.name.firstName,
      validate: true
    },
    {
      name: "lastName",
      getValue: faker.name.lastName,
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

it("returns 400 if the email is taken", async () => {
  const { requestBody } = await TestingService.createUserAccount();

  const response = await request(server)
    .post("/v1/auth/register")
    .send(requestBody)
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("EmailInUse");
});

it("creates a user if all the request is valid", async () => {
  await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234"
    })
    .expect(201);
});

it("returns an access token upon creation", async () => {
  const { user, token, requestBody } = await TestingService.createUserAccount();

  expect(user.email).toBe(requestBody.email);
  expect(token.length).toBeGreaterThan(100);
});
