import Elysia from "elysia";
import { CheckInOut } from "../models/CheckInOut";
import { CheckIn, CheckOut } from "../controllers/CheckInOutController";

export const Check = new Elysia({ prefix: "/check" });

Check.post("check-in/:id", ({ set, params }) => CheckIn(set, params));
Check.post("check-out/:id", ({ set, params }) => CheckOut(set, params));
