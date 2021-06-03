import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Handles getting an admin token
 */
const getAdminToken = async () => {
  const resp = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!"
    })
    .expect(201);

  return { token: resp.body.token };
};

it("has a router handler listening for requests", async () => {
  const res = await request(server).get("/v1/users/483895348958394").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 404 if trying to get a user that doesn't exist", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .get("/v1/users/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("ResourceNotFound");
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .get("/v1/users/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidObjectID");
});

it("returns 400 if no Authorization header is provided", async () => {
  const created = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234"
    })
    .expect(201);

  const { user } = created.body;

  const res = await request(server)
    .get(`/v1/users/${user.id}`)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe("AuthorizationRequired");
  expect(errors.length).toBeGreaterThan(0);
});

it("returns 200 and the user on a successful request", async () => {
  const { token } = await getAdminToken();

  const requestBody = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "test1234"
  };

  const created = await request(server)
    .post("/v1/auth/register")
    .send(requestBody)
    .expect(201);

  const { user } = created.body;

  const res = await request(server)
    .get(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(res.body.email).toBe(requestBody.email);
  expect(res.body.firstName).toBe(requestBody.firstName);
  expect(res.body.lastName).toBe(requestBody.lastName);
});

it("returns 401 if the request is not made by an admin", async () => {
  const requestBody = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "test1234"
  };

  const created = await request(server)
    .post("/v1/auth/register")
    .send(requestBody)
    .expect(201);

  const { user, token } = created.body;

  const res = await request(server)
    .get(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe("NotAuthorized");
  expect(errors.length).toBeGreaterThan(0);
});
