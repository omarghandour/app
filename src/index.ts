import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { users } from "../routes/usersRoutes";
import connectDB from "../db/connectDB";
import { ss } from "../routes/filesRoutes";
import cors from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import { tasks } from "../routes/tasksRoutes";
const tokensec: any = process.env.JWT_SECRET;
const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(3000)
  .use(
    jwt({
      name: "jwt",
      secret: tokensec,
      exp: "15d",
    })
  )
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .use(swagger())
  .use(users)
  .use(ss)
  .use(tasks);
connectDB();

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
