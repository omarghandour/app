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
  .get("/", ({ cookie: { auth }, set }) => {
    // auth.set({
    //   value: "await token",
    //   httpOnly: true,
    //   maxAge: 15 * 24 * 60 * 60,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/",
    // });
    return "Hello, From Elysia!";
  })
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
      origin: "localhost",
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
