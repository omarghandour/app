import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";

import { createUser, loginUser, signUP } from "../controllers/usersControllers";
import User from "../models/UserModel";
const tokensec: any = process.env.JWT_SECRET;

export const users = new Elysia({ prefix: "/users" });
users
  .use(
    jwt({
      name: "jwt",
      secret: tokensec,
      exp: "15d",
    })
  )
  .post(
    "/",
    ({ cookie: { auth }, jwt, body, set }: any) =>
      createUser(body, set, jwt, auth),
    {
      body: t.Object({
        name: t.MaybeEmpty(t.String()),
        username: t.String(),
        role: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  ) // no roles register
  .post(
    "/login",
    ({ cookie: { auth, user }, body, set, jwt }: any) =>
      loginUser(body, set, jwt, auth, user),
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  ) // no roles login
  .get("/allUsers", async () => await User.find())
  .get("/getuser/:id", async ({ params, set }: any) => {
    try {
      const user = await User.findById(params.id);
      set.status = 200;
      return { user };
    } catch (error: any) {
      console.log(error.message);
      return error.message;
    }
  })
  .get("/oneUser/:id", async ({ params, set, jwt }: any) => {
    try {
      const id = await jwt.verify(params.id);
      const user = await User.findById(id);
      if (!user) {
        set.status = 404;
        return { message: "User not found" };
      }
      set.status = 200;
      return { user };
    } catch (error: any) {
      set.status = 500;
      console.log(error.message);
    }
  })
  .post(
    "/signup",
    ({ cookie: { auth }, body, set, jwt }: any) => signUP(body, set, jwt, auth),
    {
      body: t.Object({
        name: t.MaybeEmpty(t.String()),
        username: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  );
