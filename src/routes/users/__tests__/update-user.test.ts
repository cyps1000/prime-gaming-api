import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).put("/v1/users/483895348958394").send({});
  expect(res.status).not.toEqual(404);
});
