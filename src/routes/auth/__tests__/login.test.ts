import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).post("/v1/auth/login").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if the provided inputs are not valid", async () => {
  const res = await request(server).post("/v1/auth/login").send({}).expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(2);
  expect(errors[0].field).toBe("email");
  expect(errors[0].errorType).toBe("InputValidation");
  expect(errors[1].field).toBe("password");
  expect(errors[1].errorType).toBe("InputValidation");
});

it("returns 400 if the email is wrong", async () => {
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
    .post("/v1/auth/login")
    .send({
      email: "___john@doe.com",
      password: "test1234",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidCredentials");
});

it("returns 400 if the password is wrong", async () => {
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
    .post("/v1/auth/login")
    .send({
      email: "john@doe.com",
      password: "___test1234",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidCredentials");
});

it("returns an access token upon logging in", async () => {
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
    .post("/v1/auth/login")
    .send({
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(200);

  const { token } = res.body;

  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(100);
});
