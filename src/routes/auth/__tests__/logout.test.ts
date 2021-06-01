import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).post("/v1/auth/logout").send();
  expect(res.status).not.toEqual(404);
});

it("successfully logs out", async () => {
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

  const logoutRes = await request(server)
    .post("/v1/auth/logout")
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(logoutRes.body).toBe(true);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server).post("/v1/auth/logout").send().expect(400);

  const { errors } = res.body;

  expect(errors).toBeDefined();
  expect(errors[0].errorType).toBe("AuthorizationRequired");
  expect(errors.length).toBeGreaterThan(0);
});
