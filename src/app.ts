import express, { Request, Response, json } from "express";
import "express-async-errors";
import cors, { CorsOptions } from "cors";
import { config } from "dotenv";
import { usersRouter } from "./routes/users";

/**
 * DOT ENV CONFIG
 */
config();

const { WHITELIST } = process.env;

const app = express();

app.use(json());

var whitelist = WHITELIST!.split(",");
var corsOptions: CorsOptions = {
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
console.log("CORS enabled.");
app.get("/test-api", (req, res) => {
  res.status(200).json({ message: "Hello from api" });
});

app.use(usersRouter);

app.all("*", async (req: Request, res: Response) => {
  res.status(404).send("Route not found.");
});

export { app };
