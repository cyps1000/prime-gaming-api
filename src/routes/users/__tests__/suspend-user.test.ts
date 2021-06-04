import request from "supertest";
import faker from "faker";

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

  return { token: resp.body.token, user: resp.body.user };
};

/**
 * Handles getting an admin token
 */
const getUserToken = async () => {
  const resp = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    .expect(201);

  return { token: resp.body.token, user: resp.body.user };
};

it("has a router handler listening for requests", async () => {
  const res = await request(server)
    .put("/v1/users/483895348958394/suspend")
    .send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .put("/v1/users/60b5972e408e6f2970045bee/suspend")
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 404 if the account wasn't found", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .put("/v1/users/60b5972e408e6f2970045bee/suspend")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AccountNotFound");
});

it("returns 401 if a user is trying to suspend another user's account", async () => {
  const { token: adminToken } = await getAdminToken();
  const { user: userOne } = await getUserToken();
  const { token: tokenUserTwo } = await getUserToken();

  const res = await request(server)
    .put(`/v1/users/${userOne.id}/suspend`)
    .set("Authorization", tokenUserTwo)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("NotAuthorized");

  const adminRes = await request(server)
    .put(`/v1/users/${userOne.id}/suspend`)
    .set("Authorization", adminToken)
    .send()
    .expect(200);

  const { success, user } = adminRes.body;

  expect(success).toBe(true);
  expect(user.suspended).toBe(true);
});

it("returns 200 if a user is trying to suspend his own account", async () => {
  const { user: userData, token } = await getUserToken();

  const res = await request(server)
    .put(`/v1/users/${userData.id}/suspend`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, user } = res.body;

  expect(success).toBe(true);
  expect(user.suspended).toBe(true);
});
