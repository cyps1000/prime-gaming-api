import request from "supertest";

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
  method: "delete",
  middlewares: ["requireAdminAuth"]
};

TestingService.use(config);

it("returns 404 if trying to delete an article that doesn't exist", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .delete("/v1/articles/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.ResourceNotFound);
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .delete("/v1/articles/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 200 when the request is successful", async () => {
  const { token, article, requestBody } = await TestingService.createArticle();

  expect(article.title).toBe(requestBody.title);
  expect(article.content).toBe(requestBody.content);

  const response = await request(server)
    .delete(`/v1/articles/${article.id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, article: deletedArticle } = response.body;

  expect(success).toBe(true);
  expect(deletedArticle.id).toBe(article.id);
});
