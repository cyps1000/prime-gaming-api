import request from "supertest";
import { server } from "../../../server";

describe("Input Validations", () => {
  it("returns 400 if the provided inputs are not valid", async () => {
    /**
     * Makes the api call
     */
    const response = await request(server)
      .post("/v1/auth/register")
      .send({})
      .expect(400);

    const errors = response.body.errors;

    expect(response.body.errors.length).toBe(4);

    expect(errors[0].field).toBe("email");
    expect(errors[0].message).toBe("Email must be valid");
    expect(errors[0].errorType).toBe("InputValidation");

    expect(errors[1].field).toBe("firstName");
    expect(errors[1].message).toBe("Please provide your first name");
    expect(errors[1].errorType).toBe("InputValidation");

    expect(errors[2].field).toBe("lastName");
    expect(errors[2].message).toBe("Please provide your last name");
    expect(errors[2].errorType).toBe("InputValidation");

    expect(errors[3].field).toBe("password");
    expect(errors[3].message).toBe(
      "Password must be between 4 and 20 characters"
    );
    expect(errors[3].errorType).toBe("InputValidation");
  });
});

it("has a router handler listening to /auth/register for post requests", async () => {
  const response = await request(server).post("/v1/auth/register").send({});
  expect(response.status).not.toEqual(404);
});

it("returns 400 if the email is taken", async () => {
  /**
   * Makes the api calls
   */
  await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const response = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(400);

  /**
   * Defines the error response
   */
  const error = response.body.errors[0];

  expect(response.body.errors.length).toBe(1);
  expect(error.message).toBe("Email is in use.");
  expect(error.errorType).toBe("EmailInUse");
});

it("creates a user if all the request is valid", async () => {
  await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);
});

it("returns an access token upon creation", async () => {
  const response = await request(server)
    .post("/v1/auth/register")
    .send({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "test1234",
    })
    .expect(201);

  const { user, token } = response.body;

  expect(user).toBeDefined();
  expect(token).toBeDefined();
  expect(user.email).toBe("john@doe.com");
  expect(user).toHaveProperty("id");
  expect(token.length).toBeGreaterThan(100);
});
