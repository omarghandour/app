import Elysia, { t } from "elysia";
import {
  addComment,
  createTask,
  deleteComment,
  updateTask,
} from "../controllers/tasksControllers";

export const tasks = new Elysia({ prefix: "/tasks" });

tasks
  .post(
    "/create/:id",
    ({ body, set, params }) => createTask(body, set, params),
    {
      body: t.Object({
        title: t.String(),
        description: t.MaybeEmpty(t.String()),
        attachment: t.MaybeEmpty(t.String()),
        deadlineDate: t.MaybeEmpty(t.Date()),
        assignedTo: t.String(),
      }),
    }
  )
  .patch(
    "/updateTask/:id",
    ({ body, set, params }) => updateTask(body, set, params),
    {
      body: t.Object({
        title: t.String(),
        description: t.MaybeEmpty(t.String()),
        attachment: t.MaybeEmpty(t.String()),
        deadlineDate: t.MaybeEmpty(t.Date()),
        assignedTo: t.String(),
      }),
    }
  )
  .post(
    "/addComment/:taskID/:userID",
    ({ body, set, params }) => addComment(body, set, params),
    {
      body: t.Object({
        CName: t.String(),
        content: t.String(),
      }),
    }
  )
  .delete("/deleteComment/:CID", ({ params, set }) =>
    deleteComment(params, set)
  );
