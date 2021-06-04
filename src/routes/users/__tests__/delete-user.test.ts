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
  const res = await request(server).delete("/v1/users/4325903459034").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .delete("/v1/users/4325903459034")
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 404 if trying to delete a user that doesn't exist", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .delete("/v1/users/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AccountNotFound");
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .delete("/v1/users/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidObjectID");
});

it("returns 200 when an admin deletes a user", async () => {
  const { token } = await getAdminToken();

  const created = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234"
    })
    .expect(201);

  const { user: createdUser } = created.body;

  const res = await request(server)
    .delete(`/v1/users/${createdUser.id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, user } = res.body;

  expect(success).toBe(true);
  expect(user.id).toBe(createdUser.id);
});

it("returns 401 when a user tries to delete an account that he doesn't own", async () => {
  const firstUser = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234"
    })
    .expect(201);

  const secondUser = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john2@doe.com",
      password: "test1234"
    })
    .expect(201);

  const { user: firstUserData } = firstUser.body;
  const { token: secondUserToken } = secondUser.body;

  const res = await request(server)
    .delete(`/v1/users/${firstUserData.id}`)
    .set("Authorization", secondUserToken)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("NotAuthorized");
});

it("returns 400 when a user tries to delete his account, but it's not suspended", async () => {
  const created = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234"
    })
    .expect(201);

  const { user, token } = created.body;

  const res = await request(server)
    .delete(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("NotSuspendedAccount");
});
