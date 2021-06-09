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
import { ErrorTypes } from "../../../services/error";

/**
 * Defines the test config
 */
const config: TestConfig = {
  url: "/v1/articles/60b4fa10ded55343745e29d7",
  method: "put",
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
      validate: true
    }
  ]
};

TestingService.use(config);

it("returns 400 if the article wasn't found", async () => {
  const { token, requestBody } = await TestingService.createArticle();

  const response = await request(server)
    .put("/v1/articles/60b5972e408e6f2970045bee")
    .set("Authorization", token)
    .send(requestBody)
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.ResourceNotFound);
});

it("returns 200 and the updated article", async () => {
  const { article, token } = await TestingService.createArticle();

  const requestBody = {
    title: faker.lorem.sentence(5, 10),
    content: faker.lorem.paragraph(20)
  };

  const response = await request(server)
    .put(`/v1/articles/${article.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { title, content } = response.body;

  expect(title).toBe(requestBody.title);
  expect(content).toBe(requestBody.content);
});
