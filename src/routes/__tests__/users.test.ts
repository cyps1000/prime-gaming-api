import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/User";

it("creates a user with valid inputs", async () => {
  let users = await User.find({});

  expect(users.length).toEqual(0);

  await request(app)
    .post("/v1/users/new")
    .send({
      email: "test@test.com",
      age: 25,
      name: "BOB",
    })
    .expect(201);

  const user = await User.find({});
  expect(user.length).toEqual(1);
  expect(user[0].email).toEqual("test@test.com");
  expect(user[0].age).toEqual(25);
  expect(user[0].name).toEqual("BOB");
});
