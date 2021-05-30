import request from "supertest";
import { server } from "../../../server";

describe("Input Validations", () => {
  it("returns 400 if no username was provided", async () => {
    /**
     * Makes the api call
     */
    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send({ password: "Da2xVHtnPjB1l6!" })
      .expect(400);

    /**
     * Defines the error response
     */
    const error = response.body.errors[0];

    expect(response.body.errors.length).toBe(1);
    expect(error.message).toBe("Please provide your username");
    expect(error.field).toBe("username");
    expect(error.errorType).toBe("InputValidation");
  });

  it("returns 400 if no password was provided", async () => {
    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send({
        username: "admin-root",
      })
      .expect(400);

    const error = response.body.errors[0];

    expect(response.body.errors.length).toBe(1);
    expect(error.message).toBe("Please provide your password");
    expect(error.field).toBe("password");
    expect(error.errorType).toBe("InputValidation");
  });

  it("returns 400 if the password is too short", async () => {
    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send({
        username: "admin-root",
        password: "a",
      })
      .expect(400);

    const error = response.body.errors[0];

    expect(response.body.errors.length).toBe(1);
    expect(error.message).toBe("Password must be at least 10 characters long.");
    expect(error.field).toBe("password");
    expect(error.errorType).toBe("InputValidation");
  });

  it("returns 400 if the password doesn't contain any uppercase characters", async () => {
    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send({
        username: "admin-root",
        password: "aaaaaaaaaa",
      })
      .expect(400);

    const error = response.body.errors[0];

    expect(response.body.errors.length).toBe(1);
    expect(error.message).toBe(
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    );
    expect(error.field).toBe("password");
    expect(error.errorType).toBe("InputValidation");
  });

  it("returns 400 if the password doesn't contain any numbers", async () => {
    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send({
        username: "admin-root",
        password: "aBaaaaaaaa",
      })
      .expect(400);

    const error = response.body.errors[0];

    expect(response.body.errors.length).toBe(1);
    expect(error.message).toBe(
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    );
    expect(error.field).toBe("password");
    expect(error.errorType).toBe("InputValidation");
  });

  it("returns 400 if the password doesn't contain any special characters", async () => {
    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send({
        username: "admin-root",
        password: "aB2aaaaaaa",
      })
      .expect(400);

    const error = response.body.errors[0];

    expect(response.body.errors.length).toBe(1);
    expect(error.message).toBe(
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    );
    expect(error.field).toBe("password");
    expect(error.errorType).toBe("InputValidation");
  });
});

it("has a router handler listening to /auth/register-admin for post requests", async () => {
  const response = await request(server)
    .post("/v1/auth/register-admin")
    .send({});
  expect(response.status).not.toEqual(404);
});

it("returns 400 if an account exists", async () => {
  /**
   * Makes the api calls
   */
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const response = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root2",
      password: "aB2aaaaaaa!",
    })
    .expect(400);

  /**
   * Defines the error response
   */
  const error = response.body.errors[0];

  expect(response.body.errors.length).toBe(1);
  expect(error.message).toBe(
    "An admin account already exists, contact your system administrator."
  );
  expect(error.errorType).toBe("AdminExists");
});

it("creates an admin if no admin exists", async () => {
  await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);
});

it("returns an access token upon creation", async () => {
  const response = await request(server)
    .post("/v1/auth/register-admin")
    .send({
      username: "admin-root",
      password: "Da2xVHtnPjB1l6!",
    })
    .expect(201);

  const { user, token } = response.body;

  expect(user).toBeDefined();
  expect(token).toBeDefined();
  expect(user.username).toBe("admin-root");
  expect(user.role).toBe("prime-admin");
  expect(user).toHaveProperty("id");
  expect(token.length).toBeGreaterThan(100);
});
