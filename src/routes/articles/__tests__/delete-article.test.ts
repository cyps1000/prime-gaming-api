import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

/**
 * Handles getting an admin token
 */
const getAdminToken = async () => {
  const resp = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  return { token: resp.body.token };
};

it("has a router handler listening for requests", async () => {
  const res = await request(server)
    .delete("/v1/articles/4325903459034")
    .send({});
  expect(res.status).not.toEqual(404);
});

it("returns 400 if no Authorization header is provided", async () => {
  const res = await request(server)
    .delete("/v1/articles/4325903459034")
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("AuthorizationRequired");
});

it("returns 404 if trying to delete an article that doesn't exist", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .delete("/v1/articles/60b4fa10ded55343745e29d7")
    .set("Authorization", token)
    .send()
    .expect(404);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("ResourceNotFound");
});

it("returns 400 if the provided param id is invalid", async () => {
  const { token } = await getAdminToken();

  const res = await request(server)
    .delete("/v1/articles/this_is_an_invalid_id")
    .set("Authorization", token)
    .send()
    .expect(400);

  const { errors } = res.body;

  expect(errors.length).toBe(1);
  expect(errors[0].errorType).toBe("InvalidObjectID");
});

it("returns 200 when the request is successful", async () => {
  const { token } = await getAdminToken();

  const requestBody = {
    title: "Test Article",
    content: "Test content",
  };

  const created = await request(server)
    .post("/v1/articles")
    .set("Authorization", token)
    .send(requestBody)
    .expect(201);

  const { title, content, id } = created.body;

  expect(title).toBe(requestBody.title);
  expect(content).toBe(requestBody.content);

  const res = await request(server)
    .delete(`/v1/articles/${id}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  const { success, article } = res.body;

  expect(success).toBe(true);
  expect(article.id).toBe(id);
});
