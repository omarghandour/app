// // test/index.test.ts
// import { describe, expect, it } from "bun:test";
// import { Elysia } from "elysia";

// describe("Elysia", () => {
//   it("return a response", async () => {
//     const app = new Elysia().get("/", () => "hi");

//     const response = await app
//       .handle(new Request("http://localhost/"))
//       .then((res) => res.text());

//     expect(response).toBe("hi");
//   });
// });
// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { treaty } from "@elysiajs/eden";

const app = new Elysia().get("/hello", "hi");

const api = treaty(app);

describe("Elysia", () => {
  it("return a response", async () => {
    const { data, error } = await api.hello.get();

    expect(data).toBe("hi");
  });
});
