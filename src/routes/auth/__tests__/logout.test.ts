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
  url: "/v1/auth/logout",
  method: "post",
  middlewares: ["requireAuth"]
};

TestingService.use(config);

it("successfully logs out", async () => {
  const { token: userToken } = await TestingService.createUserAccount();
  const { token: adminToken } = await TestingService.createAdminAccount();

  await request(server)
    .post("/v1/auth/logout")
    .set("Authorization", userToken)
    .send()
    .expect(200);

  await request(server)
    .post("/v1/auth/logout")
    .set("Authorization", adminToken)
    .send()
    .expect(200);
});
