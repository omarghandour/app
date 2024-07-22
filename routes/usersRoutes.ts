import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";

import { createUser, loginUser } from "../controllers/usersControllers";
const tokensec: any = process.env.JWT_SECRET;

export const users = new Elysia({ prefix: "/users" });
users

  .post("/", ({ jwt, body, set, cookie: { auth } }: any) =>
    createUser(body, set, jwt, auth)
  )
  .post(
    "/login",
    ({ body, set, jwt, cookie: { auth } }: any) =>
      loginUser(body, set, jwt, auth),
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  );
