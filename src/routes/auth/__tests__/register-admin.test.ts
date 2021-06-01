import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).post("/v1/auth/register-admin").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no username was provided", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({ password: "Da2xVHtnPjB1l6!" })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].field).toBe("username");
  expect(errors[0].errorType).toBe("InputValidation");
});

it("returns 400 if no password was provided", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].field).toBe("password");
  expect(errors[0].errorType).toBe("InputValidation");
});

it("returns 400 if the password is too short", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "a",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].field).toBe("password");
  expect(errors[0].errorType).toBe("InputValidation");
});

it("returns 400 if the password doesn't contain any uppercase characters", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "aaaaaaaaaa",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].field).toBe("password");
  expect(errors[0].errorType).toBe("InputValidation");
});

it("returns 400 if the password doesn't contain any numbers", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "aBaaaaaaaa",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].field).toBe("password");
  expect(errors[0].errorType).toBe("InputValidation");
});

it("returns 400 if the password doesn't contain any special characters", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "aB2aaaaaaa",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].field).toBe("password");
  expect(errors[0].errorType).toBe("InputValidation");
});

it("returns 400 if an account exists", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root2",
      password: "aB2aaaaaaa!",
    })
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AdminExists");
});

it("creates an admin if no admin exists", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);
});

it("returns an access token upon creation", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const { user, token } = res.body;

  expect(user).toBeDefined();
  expect(token).toBeDefined();
  expect(user.username).toBe("admin-root");
  expect(user.role).toBe("prime-admin");
  expect(user).toHaveProperty("id");
  expect(token.length).toBeGreaterThan(100);
});
