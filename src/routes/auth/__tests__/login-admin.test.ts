import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).post("/v1/auth/login-admin").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if the provided inputs are not valid", async () => {
  const res = await request(server)
    .post("/v1/auth/login-admin")
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(2);
  expect(errors[0].field).toBe("username");
  expect(errors[0].errorType).toBe("InputValidation");
  expect(errors[1].field).toBe("password");
  expect(errors[1].errorType).toBe("InputValidation");
});

it("returns 400 if the username is wrong", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "random-admin",
      password: "B6aXTNjkII3Qn4A@",
    })
    .expect(201);

  const res = await request(server)
    .post("/v1/auth/login-admin")
    .send({
      username: "___john@doe.com",
      password: "B6aXTNjkII3Qn4A@",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidCredentials");
});

it("returns 400 if the password is wrong", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "random-admin",
      password: "B6aXTNjkII3Qn4A@",
    })
    .expect(201);

  const res = await request(server)
    .post("/v1/auth/login-admin")
    .send({
      username: "random-admin",
      password: "A6aXTNjkII3Qn4A@",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidCredentials");
});

it("returns an access token upon logging in", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "random-admin",
      password: "A6aXTNjkII3Qn4A@",
    })
    .expect(201);

  const res = await request(server)
    .post("/v1/auth/login-admin")
    .send({
      username: "random-admin",
      password: "A6aXTNjkII3Qn4A@",
    })
    .expect(200);

  const { token } = res.body;

  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(100);
});
