import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { users } from "../routes/usersRoutes";
import connectDB from "../db/connectDB";
import { ss } from "../routes/filesRoutes";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(3000)
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .use(swagger())
  .use(users)
  .use(ss);
connectDB();

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
