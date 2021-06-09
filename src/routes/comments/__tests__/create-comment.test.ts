import request from "supertest";
import mongoose from "mongoose";
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
  url: "/v1/comments",
  method: "post",
  middlewares: ["requireAuth", "validateRequest"],
  fields: [
    {
      name: "content",
      getValue: () => faker.lorem.paragraph(3),
      validate: true
    },
    {
      name: "articleId",
      getValue: () => faker.random.alphaNumeric(6),
      validate: true
    }
  ]
};

TestingService.use(config);

it("returns 201 and the created comment", async () => {
  const { token, article } = await TestingService.createArticle();

  const requestBody = {
    content: faker.lorem.sentence(2),
    articleId: article.id
  };

  const response = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  const { articleId, content } = response.body;

  expect(articleId).toBe(requestBody.articleId);
  expect(content).toBe(requestBody.content);
});

it("returns 404 when the article doesn't exist", async () => {
  const { token } = await TestingService.createArticle();

  const requestBody = {
    content: faker.lorem.sentence(2),
    articleId: mongoose.Types.ObjectId().toHexString()
  };

  const response = await request(server)
    .post("/v1/comments")
    .set("Authorization", token)
    .send(requestBody)
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.ResourceNotFound);
});
