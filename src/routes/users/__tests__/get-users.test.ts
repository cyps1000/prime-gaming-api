import request from "supertest";

/**
 * Imports the server
 */
import { server } from "../../../server";

it("has a router handler listening for requests", async () => {
  const res = await request(server).get("/v1/users").send({});
  expect(res.status).not.toEqual(404);
});
