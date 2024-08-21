import Elysia, { t } from "elysia";
import Task from "../models/TaskModel";
import jwt from "@elysiajs/jwt";
import mongoose from "mongoose";

const tokensec: any = process.env.JWT_SECRET;

const userSockets = new Map<string, any>(); // Map to store userId and their WebSocket connection

export const websocket = new Elysia({ prefix: "/ws" }).use(
  jwt({
    name: "jwt",
    secret: tokensec,
    exp: "15d",
  })
);

websocket.ws("/:id", {
  async open(ws) {
    // Store WebSocket connections based on verified user ID
    const userID = ws.data.params.id;
    const verifyID: any = await ws.data.jwt.verify(userID);
    // console.log(verifyID);

    userSockets.set(verifyID.id, ws);
  },
  async message(ws) {
    const userID = ws.data.params.id;
    const verifyID: any = await ws.data.jwt.verify(userID);
    const ID: any = verifyID.id;
    const unreadTasks = await Task.find({ assignedTo: ID, read: false });

    ws.send({ unreadCount: unreadTasks.length });
  },
  async close(ws) {
    const userID = ws.data.params.id;
    const verifyID: any = await ws.data.jwt.verify(userID);

    // console.log(userID);

    userSockets.delete(verifyID); // Remove the WebSocket connection on close
  },
});

// Watch for changes in the Task collection
const taskChangeStream = Task.watch();

taskChangeStream.on("change", async (change) => {
  // if (change.operationType === "insert" || change.operationType === "update") {
  const { assignedTo } = change.fullDocument;

  // Find unread tasks for the user whose task was changed
  const unreadTasks = await Task.find({ assignedTo, read: false });

  // Send the update to the relevant WebSocket client
  const client = userSockets.get(assignedTo);
  if (client) {
    client.send(JSON.stringify({ unreadCount: unreadTasks.length }));
  }
  // }
});
