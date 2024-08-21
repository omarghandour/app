import Elysia, { t } from "elysia";
import Task from "../models/TaskModel";
import jwt from "@elysiajs/jwt";
const tokensec: any = process.env.JWT_SECRET;

export const websocket = new Elysia({ prefix: "/ws" }).use(
  jwt({
    name: "jwt",
    secret: tokensec,
    exp: "15d",
  })
);

websocket.ws("/", {
  async message(ws, message: any) {
    const userID = message.id;
    const verifyID: any = await ws.data.jwt.verify(userID);
    const ID: any = verifyID.id;
    const unreadTasks = await Task.find({ assignedTo: ID, read: false });
    console.log(userID);

    ws.send(unreadTasks.length);
  },
});
