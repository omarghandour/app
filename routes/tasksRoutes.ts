import Elysia, { t } from "elysia";
import {
  addComment,
  Approved,
  createTask,
  deleteComment,
  deleteTask,
  getAllTasks,
  getComments,
  readTask,
  setTaskStatus,
  taskById,
  taskReject,
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
  // .patch("/taskStatus/:id", ({ set, params }) => setTaskStatus(set, params))
  .delete("/delete/:userID/:taskID", ({ set, params }) =>
    deleteTask(set, params)
  )
  .post(
    "/addComment/:taskID/:userID",
    ({ body, set, params, jwt }: any) => addComment(body, set, params, jwt),
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )
  .get("comment/:taskID", ({ set, params }) => getComments(set, params))
  .delete("/deleteComment/:CID", ({ params, set }) =>
    deleteComment(params, set)
  )
  .get("/:id/:role", ({ params, set, jwt }: any) => usersTask(params, set, jwt))
  .get("/task/:id", ({ params, set, jwt }: any) => taskById(params, set, jwt))
  .patch("task/:id", ({ params, set, jwt }: any) =>
    setTaskStatus(params, set, jwt)
  )
  .patch("task/reject/:id", ({ params, set, jwt }: any) =>
    taskReject(params, set, jwt)
  )
  .delete("task/:id", ({ params, set, jwt }: any) => Approved(params, set, jwt))
  .get("/read/:id", ({ set, params }: any) => readTask(set, params));
