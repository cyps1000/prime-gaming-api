import request from "supertest";
import { server } from "../../../server";

it("returns 200 and the user's data", async () => {
  /**
   * Makes the api calls
   */
  const response = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const currentUserResp = await request(server)
    .get("/v1/auth")
    .set("Authorization", response.body.token)
    .send()
    .expect(200);

  expect(currentUserResp.body.email).toBe("john@doe.com");
});

it("returns 400 if no Authorization header is provided", async () => {
  const response = await request(server).get("/v1/auth").send().expect(400);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].message).toBe(
    "The authorization header is required."
  );
  expect(response.body.errors[0].errorType).toBe("AuthorizationRequired");
  expect(response.body.errors.length).toBeGreaterThan(0);
});

it("returns 200 and an admin account if the token is for an admin account", async () => {
  const response = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const currentUserResp = await request(server)
    .get("/v1/auth")
    .set("Authorization", response.body.token)
    .send()
    .expect(200);

  expect(currentUserResp.body.role).toBe("prime-admin");
});

it("has a router handler listening to /auth/current-user for get requests", async () => {
  const response = await request(server).get("/v1/auth").send();
  expect(response.status).not.toEqual(404);
});
