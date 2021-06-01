import request from "supertest";
import jwt from "jsonwebtoken";
import { AccessToken } from "../../auth/types";

/**
 * Imports models
 */
import { Admin, User } from "../../../models";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a route handler listening for requests", async () => {
  const res = await request(server).get("/v1/auth").send();
  expect(res.status).not.toEqual(404);
});

it("returns 200 and the user's data", async () => {
  const res = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const { token } = res.body;

  const authRes = await request(server)
    .get("/v1/auth")
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(authRes.body.email).toBe("john@doe.com");
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server).get("/v1/auth").send().expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 200 and an admin account if the token is for an admin account", async () => {
  const res = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const { token } = res.body;

  const authRes = await request(server)
    .get("/v1/auth")
    .set("Authorization", token)
    .send()
    .expect(200);

  const { role } = authRes.body;

  expect(role).toBe("prime-admin");
});

it("returns 404 if no account was found (admin), despite the token existing", async () => {
  const registerRes = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const { token } = registerRes.body;

  const decoded = jwt.verify(token, process.env.JWT_KEY!);
  const accessToken = decoded as AccessToken;
  const admin = await Admin.findById(accessToken.id);

  expect(admin).toBeDefined();

  await admin!.remove();

  const res = await request(server)
    .get("/v1/auth")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AccountNotFound");
});

it("returns 404 if no account was found (user), despite the token existing", async () => {
  const registerRes = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const { token } = registerRes.body;

  const decoded = jwt.verify(token, process.env.JWT_KEY!);
  const accessToken = decoded as AccessToken;
  const user = await User.findById(accessToken.id);

  expect(user).toBeDefined();

  await user!.remove();

  const res = await request(server)
    .get("/v1/auth")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AccountNotFound");
});
