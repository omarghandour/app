import Elysia, { t } from "elysia";
import { filesUpload, getFile } from "../controllers/filesUpload";
export const ss = new Elysia({ prefix: "/files" })
  .post("/s/:id", ({ body, params, set }) => filesUpload(body, params, set), {
    body: t.Object({
      file: t.File(),
    }),
  })
  .get("s/:filename", ({ params }) => getFile(params))
  .delete("s/:filename", ({ params, set }) => deleteFile(params, set));
