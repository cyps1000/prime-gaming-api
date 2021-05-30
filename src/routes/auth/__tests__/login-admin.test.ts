import request from "supertest";
import { server } from "../../../server";

describe("Input Validations", () => {
  it("returns 400 if the provided inputs are not valid", async () => {
    /**
     * Makes the api call
     */
    const response = await request(server)
      .post("/v1/auth/login-admin")
      .send({})
      .expect(400);

    const errors = response.body.errors;

    expect(response.body.errors.length).toBe(2);

    expect(errors[0].field).toBe("username");
    expect(errors[0].message).toBe("Please provide a username");
    expect(errors[0].errorType).toBe("InputValidation");

    expect(errors[1].field).toBe("password");
    expect(errors[1].message).toBe("You must provide a password.");
    expect(errors[1].errorType).toBe("InputValidation");
  });
});

it("has a router handler listening to /auth/login-admin for post requests", async () => {
  const response = await request(server).post("/v1/auth/login-admin").send({});
  expect(response.status).not.toEqual(404);
});

it("returns 400 if the username is wrong", async () => {
  /**
   * Makes the api calls
   */
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "random-admin",
      password: "B6aXTNjkII3Qn4A@",
    })
    .expect(201);

  const response = await request(server)
    .post("/v1/auth/login-admin")
    .send({
      username: "___john@doe.com",
      password: "B6aXTNjkII3Qn4A@",
    })
    .expect(400);

  /**
   * Defines the error response
   */
  const error = response.body.errors[0];

  expect(response.body.errors.length).toBe(1);
  expect(error.message).toBe("Invalid credentials.");
  expect(error.errorType).toBe("InvalidCredentials");
});

it("returns 400 if the password is wrong", async () => {
  /**
   * Makes the api calls
   */
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "random-admin",
      password: "B6aXTNjkII3Qn4A@",
    })
    .expect(201);

  const response = await request(server)
    .post("/v1/auth/login-admin")
    .send({
      username: "random-admin",
      password: "A6aXTNjkII3Qn4A@",
    })
    .expect(400);

  /**
   * Defines the error response
   */
  const error = response.body.errors[0];

  expect(response.body.errors.length).toBe(1);
  expect(error.message).toBe("Invalid credentials.");
  expect(error.errorType).toBe("InvalidCredentials");
});

it("returns an access token upon logging in", async () => {
  /**
   * Makes the api calls
   */
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "random-admin",
      password: "A6aXTNjkII3Qn4A@",
    })
    .expect(201);

  const response = await request(server)
    .post("/v1/auth/login-admin")
    .send({
      username: "random-admin",
      password: "A6aXTNjkII3Qn4A@",
    })
    .expect(200);

  const { token } = response.body;

  expect(token).toBeDefined();
  expect(token.length).toBeGreaterThan(100);
});
