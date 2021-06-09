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
  url: "/v1/comments/60b4fa10ded55343745e29d7",
  method: "get",
  middlewares: []
};

TestingService.use(config);

it("returns 404 if trying to get an comment that doesn't exist", async () => {
  const response = await request(server)
    .get("/v1/comments/60b4fa10ded55343745e29d7")
    .send()
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.ResourceNotFound);
});

it("returns 400 if the provided param id is invalid", async () => {
  const response = await request(server)
    .get("/v1/comments/this_is_an_invalid_id")
    .send()
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 200 and the comment on a successful request", async () => {
  const { comment, requestBody } = await TestingService.createComment();

  expect(comment.articleId).toBe(requestBody.articleId);
  expect(comment.content).toBe(requestBody.content);

  const response = await request(server)
    .get(`/v1/comments/${comment.id}`)
    .send()
    .expect(200);

  expect(response.body.id).toBe(comment.id);
  expect(response.body.content).toBe(comment.content);
});
