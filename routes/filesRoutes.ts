import Elysia, { t } from "elysia";
import { filesUpload, getFile } from "../controllers/filesUpload";
export const ss = new Elysia({ prefix: "/files" })
  .post("/s/:id", ({ body }) => filesUpload(body), {
    body: t.Object({
      image: t.File(),
    }),
  })
  .get("s/:filename", ({ params }) => getFile(params));
