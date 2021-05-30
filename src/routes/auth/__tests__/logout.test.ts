import request from "supertest";
import { server } from "../../../server";

it("returns 200 and a new access token", async () => {
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

  const logoutResponse = await request(server)
    .post("/v1/auth/logout")
    .set("Authorization", response.body.token)
    .send()
    .expect(200);

  expect(logoutResponse.body).toBe(true);
});

it("returns 400 if no Authorization header is provided", async () => {
  const response = await request(server)
    .post("/v1/auth/logout")
    .send()
    .expect(400);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].message).toBe(
    "The authorization header is required."
  );
  expect(response.body.errors[0].errorType).toBe("AuthorizationRequired");
  expect(response.body.errors.length).toBeGreaterThan(0);
});

it("has a router handler listening to /auth/logout for post requests", async () => {
  const response = await request(server).post("/v1/auth/logout").send();
  expect(response.status).not.toEqual(404);
});
