import Elysia, { t } from "elysia";
import {
  addComment,
  createTask,
  deleteComment,
  deleteTask,
  getAllTasks,
  taskById,
  updateTask,
  usersTask,
} from "../controllers/tasksControllers";

export const tasks = new Elysia({ prefix: "/tasks" });

tasks
  .post(
    "/create/:id",
    ({ body, set, params, jwt }: any) => createTask(body, set, params, jwt),
    {
      body: t.Object({
        title: t.String(),
        description: t.MaybeEmpty(t.String()),
        // attachment: t.MaybeEmpty(t.String()),
        deadlineDate: t.String(),
        assignedTo: t.String(),
      }),
    }
  ) // create a new task
  .get("/", ({ set }) => getAllTasks(set))
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
  ) // update a task by id
  .delete("/delete/:userID/:taskID", ({ set, params }) =>
    deleteTask(set, params)
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
  )
  .get("/:id", ({ params, set, jwt }: any) => usersTask(params, set, jwt))
  .get("/task/:id", ({ params, set, jwt }: any) => taskById(params, set, jwt));
