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
  const res = await request(server).put("/v1/users/483895348958394").send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .put("/v1/users/60b5972e408e6f2970045bee")
    .send({})
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 404 if the account wasn't found", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .put("/v1/users/60b5972e408e6f2970045bee")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AccountNotFound");
});

it("returns 401 if a user is trying to update another user's account", async () => {
  const { token: adminToken } = await getAdminToken();
  const { user: userOne } = await getUserToken();
  const { token: tokenUserTwo } = await getUserToken();

  const res = await request(server)
    .put(`/v1/users/${userOne.id}`)
    .set("Authorization", tokenUserTwo)
    .send()
    .expect(401);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("NotAuthorized");

  const requestBody = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  };

  const adminRes = await request(server)
    .put(`/v1/users/${userOne.id}`)
    .set("Authorization", adminToken)
    .send(requestBody)
    .expect(200);

  const { success, user } = adminRes.body;

  expect(success).toBe(true);
  expect(user.suspended).toBe(false);
});

it("returns 200 if a user is trying to update his own account", async () => {
  const { user: userData, token } = await getUserToken();

  const requestBody = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  };

  const res = await request(server)
    .put(`/v1/users/${userData.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { success, user } = res.body;

  expect(success).toBe(true);
  expect(user.email).toBe(requestBody.email);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
});

it("returns 200 if a user is trying to update his own account but changes nothing", async () => {
  const { user: userData, token } = await getUserToken();
  const res = await request(server)
    .put(`/v1/users/${userData.id}`)
    .set("Authorization", token)
    .send({})
    .expect(200);

  const { success, user } = res.body;

  expect(success).toBe(true);
  expect(user.email).toBe(userData.email);
  expect(user.firstName).toBe(userData.firstName);
  expect(user.lastName).toBe(userData.lastName);
});

it("returns 400 if the email is already in use", async () => {
  const { user, token } = await getUserToken();
  const { user: existingUser } = await getUserToken();

  const requestBody = {
    email: existingUser.email
  };

  const res = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("EmailInUse");
});

it("returns 400 if the provided inputs are not valid", async () => {
  const { user, token } = await getUserToken();

  const requestBody = {
    email: "asdasd",
    firstName: "",
    lastName: ""
  };

  const res = await request(server)
    .put(`/v1/users/${user.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(3);

  expect(errors[0].field).toBe("email");
  expect(errors[0].errorType).toBe("InputValidation");

  expect(errors[1].field).toBe("firstName");
  expect(errors[1].errorType).toBe("InputValidation");

  expect(errors[2].field).toBe("lastName");
  expect(errors[2].errorType).toBe("InputValidation");
});
