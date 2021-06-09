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
  url: "/v1/comments/60b4fa10ded55343745e29d7",
  method: "delete",
  middlewares: ["requireAuth"]
};

TestingService.use(config);

it("returns 404 if trying to delete a comment that doesn't exist", async () => {
  const { token } = await TestingService.createAdminAccount();

  const response = await request(server)
    .delete("/v1/comments/60b4fa10ded55343745e29d7")
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
    .delete("/v1/comments/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 400 if a user is trying to delete another user's comment", async () => {
  const { comment } = await TestingService.createComment();
  const { token } = await TestingService.createUserAccount();

  const response = await request(server)
    .delete(`/v1/comments/${comment.id}`)
    .set("Authorization", token)
    .send()
    .expect(401);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
});

it("allows an admin to delete another user's comment", async () => {
  const { comment, adminToken } = await TestingService.createComment();

  const response = await request(server)
    .delete(`/v1/comments/${comment.id}`)
    .set("Authorization", adminToken)
    .send()
    .expect(200);

  const { success, comment: responseComment } = response.body;

  expect(success).toBe(true);
  expect(responseComment.id).toBe(comment.id);
});

it("returns 200 when the request is successful", async () => {
  const { comment, token } = await TestingService.createComment();

  const response = await request(server)
    .delete(`/v1/comments/${comment.id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, comment: responseComment } = response.body;

  expect(success).toBe(true);
  expect(responseComment.id).toBe(comment.id);
});
