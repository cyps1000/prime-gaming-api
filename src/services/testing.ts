import request from "supertest";
import faker from "faker";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Imports the server
 */
import { server } from "../server";

/**
 * Imports models
 */
import { Admin, User } from "../models";

/**
 * Imports services
 */
import { ErrorTypes } from "./error";

/**
 * Defines the middleware type
 */
type Middleware =
  | "requireAuth"
  | "requireAdminAuth"
  | "currentUser"
  | "validateRequest";

/**
 * Defines the Test Config Interface
 */
export interface TestConfig {
  url: string;
  method: "get" | "post" | "put" | "delete";
  middlewares: Middleware[];
  body?: {
    [key: string]: any;
  };
  fields?: {
    name: string;
    getValue: Function;
    validate: boolean;
    type?: "param";
  }[];
}

/**
 * Defines the auth service
 */
export class TestingService {
  static async execute(testConfig: TestConfig) {
    const { url, method, middlewares, body, fields } = testConfig;

    if (!method) throw new Error("No method provided");
    if (!url) throw new Error("No url provided");

    it(`TestingService:${method.toUpperCase()} - ${url} - has a route handler listening for requests`, async () => {
      const response = await request(server)
        [method](url)
        .send(body || {});

      expect(response.status).not.toEqual(404);
    });

    if (
      middlewares.includes("requireAuth") ||
      middlewares.includes("requireAdminAuth")
    ) {
      it(`TestingService:${method.toUpperCase()} - ${url} - returns 400 if no Authorization header is provided`, async () => {
        const response = await request(server)
          [method](url)
          .send(body || {})
          .expect(400);

        const { errors } = response.body;

        expect(errors.length).toBe(1);
        expect(errors[0].errorType).toBe(ErrorTypes.AuthorizationRequired);
      });
    }

    if (middlewares.includes("requireAuth")) {
      it(`TestingService:${method.toUpperCase()} - ${url} - returns 404 if no user was found`, async () => {
        const { token, user } = await this.createUserAccount();

        const foundUser = await User.findById(user.id);

        await foundUser!.remove();

        const response = await request(server)
          [method](url)
          .set("Authorization", token)
          .send(body || {})
          .expect(404);

        const { errors } = response.body;

        expect(errors.length).toBe(1);
        expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
      });

      it(`TestingService:${method.toUpperCase()} - ${url} - returns 404 if no admin was found`, async () => {
        const { token, user } = await this.createAdminAccount();

        const foundAdmin = await Admin.findById(user.id);

        await foundAdmin!.remove();

        const response = await request(server)
          [method](url)
          .set("Authorization", token)
          .send(body || {})
          .expect(404);

        const { errors } = response.body;

        expect(errors.length).toBe(1);
        expect(errors[0].errorType).toBe(ErrorTypes.AccountNotFound);
      });
    }

    if (middlewares.includes("validateRequest")) {
      it(`TestingService:${method.toUpperCase()} - ${url} - returns 400 if the provided inputs are not valid`, async () => {
        let Authorization: string = "";

        if (middlewares.includes("requireAuth")) {
          const { token } = await this.createUserAccount();
          Authorization = token;
        }

        if (middlewares.includes("requireAdminAuth")) {
          const { token } = await this.createAdminAccount();
          Authorization = token;
        }

        const response = await request(server)
          [method](url)
          .set("Authorization", Authorization)
          .send({});
        expect(response.status).toEqual(400);

        const { errors } = response.body;

        fields?.forEach((field, index) => {
          const { name, validate } = field;

          if (validate) {
            const length = fields.filter((f) => f.validate).length;
            expect(errors.length).toBe(length);
            expect(errors[index].field).toBe(name);
            expect(errors[index].errorType).toBe(ErrorTypes.InputValidation);
          }
        });
      });

      it(`TestingService:${method.toUpperCase()} - ${url} - passes the input validation`, async () => {
        let Authorization: string = "";

        if (middlewares.includes("requireAuth")) {
          const { token } = await this.createUserAccount();
          Authorization = token;
        }

        if (middlewares.includes("requireAdminAuth")) {
          const { token } = await this.createAdminAccount();
          Authorization = token;
        }

        const requestBody = this.generateRequestBody(fields);
        const response = await request(server)
          [method](url)
          .set("Authorization", Authorization)
          .send(requestBody);

        if (response.body.errors) {
          const { errors } = response.body;
          expect(errors[0].errorType).not.toBe(ErrorTypes.InputValidation);
        }
      });
    }
  }

  static generateRequestBody(fields: TestConfig["fields"]) {
    const body: TestConfig["body"] = {};

    fields?.forEach((field) => {
      const { name, getValue } = field;
      body[name] = getValue();
    });

    return body;
  }

  static async createUserAccount() {
    const requestBody = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await request(server)
      .post("/v1/auth/register")
      .send(requestBody)
      .expect(201);

    const { token, user } = response.body;

    return { token, user, requestBody, response };
  }

  static async createAdminAccount() {
    const requestBody = {
      username: faker.internet.userName(),
      password: "Hj7sSfes2AS556vFr!"
    };

    const response = await request(server)
      .post("/v1/auth/register-admin")
      .send(requestBody)
      .expect(201);

    const { token, user } = response.body;

    return { token, user, requestBody, response };
  }

  static async createArticle() {
    const { token } = await this.createAdminAccount();

    const requestBody = {
      title: faker.lorem.sentence(3),
      content: faker.lorem.paragraph(3)
    };

    const response = await request(server)
      .post("/v1/articles")
      .set("Authorization", token)
      .send(requestBody)
      .expect(201);

    const article = response.body;

    return { article, response, token, requestBody };
  }

  static generateToken(config?: {
    invalid?: boolean;
    expired?: boolean;
    malformed?: boolean;
  }) {
    if (config?.malformed) return "invalid-token";

    const secretKey = config?.invalid ? "invalid_secret" : process.env.JWT_KEY!;
    const payload = {
      id: mongoose.Types.ObjectId().toHexString()
    };

    return jwt.sign(payload, secretKey, {
      expiresIn: config?.expired ? 1 : 60
    });
  }
}
