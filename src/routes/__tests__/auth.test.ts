import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/User";

it("returns a 400 when no email is provided", async () => {
  let users = await User.find({});

  expect(users.length).toEqual(0);

  await request(app)
    .post("/v1/auth/register")
    .send({
      firstName: "BOB",
      lastName: "Not Bob",
    })
    .expect(400);
});
