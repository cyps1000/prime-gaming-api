import request from "supertest";
import faker from "faker";

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
  url: "/v1/articles",
  method: "post",
  middlewares: ["requireAdminAuth", "validateRequest"],
  fields: [
    {
      name: "title",
      getValue: () => faker.lorem.sentence(3),
      validate: true
    },
    {
      name: "content",
      getValue: () => faker.lorem.paragraph(3),
      validate: false
    }
  ]
};

TestingService.execute(config);

it("returns 201 and the created article", async () => {
  const { token } = await TestingService.createAdminAccount();

  /**
   * Defines the request body
   */
  const requestBody = {
    title: faker.lorem.sentence(3),
    content: faker.lorem.paragraph(3)
  };

  const response = await request(server)
    .post("/v1/articles")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  const { title, content } = response.body;

  expect(title).toBe(requestBody.title);
  expect(content).toBe(requestBody.content);
});
