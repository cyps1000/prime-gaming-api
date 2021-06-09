import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Imports services
 */
import { TestingService, TestConfig } from "../../../services/testing";

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/auth",
  method: "get",
  middlewares: ["requireAuth"]
};

TestingService.use(config);

it("returns 200 and the user's data", async () => {
  const { token, user } = await TestingService.createUserAccount();

  const response = await request(server)
    .get("/v1/auth")
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(response.body.email).toBe(user.email);
});

it("returns 200 and an admin account if the token is for an admin account", async () => {
  const { token, user } = await TestingService.createAdminAccount();

  const response = await request(server)
    .get("/v1/auth")
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(response.body.role).toBe(user.role);
});
