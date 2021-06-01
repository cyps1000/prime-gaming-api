import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Checks if the route handler exists
 */
it("has a router handler listening for requests", async () => {
  const res = await request(server).post("/v1/auth/register").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if the provided inputs are not valid", async () => {
  const res = await request(server)
    .post("/v1/auth/register")
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(4);

  expect(errors[0].field).toBe("email");
  expect(errors[0].errorType).toBe("InputValidation");

  expect(errors[1].field).toBe("firstName");
  expect(errors[1].errorType).toBe("InputValidation");

  expect(errors[2].field).toBe("lastName");
  expect(errors[2].errorType).toBe("InputValidation");

  expect(errors[3].field).toBe("password");
  expect(errors[3].errorType).toBe("InputValidation");
});

it("returns 400 if the email is taken", async () => {
  await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const res = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(400);

  const { errors } = res.body;

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
      password: "test1234",
    })
    .expect(201);
});

it("returns an access token upon creation", async () => {
  const res = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const { user, token } = res.body;

  expect(user).toBeDefined();
  expect(token).toBeDefined();
  expect(user.email).toBe("john@doe.com");
  expect(user).toHaveProperty("id");
  expect(token.length).toBeGreaterThan(100);
});
