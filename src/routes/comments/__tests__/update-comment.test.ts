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
  method: "put",
  middlewares: ["requireAuth", "validateRequest"],
  fields: [
    {
      name: "content",
      getValue: () => faker.lorem.paragraph(3),
      validate: true,
    },
  ],
};

TestingService.use(config);

it("returns 404 if trying to update a comment that doesn't exist", async () => {
  const { token } = await TestingService.createAdminAccount();

  const requestBodyModerated = {
    content: faker.lorem.sentence(5),
  };

  const response = await request(server)
    .put("/v1/comments/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send(requestBodyModerated)
    .expect(404);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.ResourceNotFound);
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await TestingService.createAdminAccount();

  const requestBody = {
    content: faker.lorem.sentence(5),
  };

  const response = await request(server)
    .put("/v1/comments/this_is_an_invalid_id")
    .set("Authorization", token)
    .send(requestBody)
    .expect(400);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.InvalidObjectID);
});

it("returns 404 if a user is trying to update a comment that doesn't belong to him", async () => {
  const { comment } = await TestingService.createComment();
  const { token: secondUser } = await TestingService.createUserAccount();

  const requestBody = {
    content: faker.lorem.sentence(5),
  };

  const response = await request(server)
    .put(`/v1/comments/${comment.id}`)
    .set("Authorization", secondUser)
    .send(requestBody)
    .expect(401);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
});

it("returns 400 if an admin is trying to update a comment that doesn't belong to him", async () => {
  const { comment, adminToken } = await TestingService.createComment();

  const requestBody = {
    content: faker.lorem.sentence(5),
  };

  const response = await request(server)
    .put(`/v1/comments/${comment.id}`)
    .set("Authorization", adminToken)
    .send(requestBody)
    .expect(401);

  const { errors } = response.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe(ErrorTypes.NotAuthorized);
});

it("returns 200 when the request is successful", async () => {
  const { comment, token } = await TestingService.createComment();

  const requestBody = {
    content: faker.lorem.sentence(5),
  };

  const response = await request(server)
    .put(`/v1/comments/${comment.id}`)
    .set("Authorization", token)
    .send(requestBody)
    .expect(200);

  const { success, comment: responseComment } = response.body;

  expect(success).toBe(true);
  expect(responseComment.id).toBe(comment.id);
  expect(responseComment.content).toBe(requestBody.content);
});
