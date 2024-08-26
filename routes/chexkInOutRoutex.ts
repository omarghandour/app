import Elysia from "elysia";
import {
  CheckIn,
  CheckInOnline,
  CheckOut,
  CheckOutOnline,
} from "../controllers/CheckInOutController";

export const Check = new Elysia({ prefix: "/check" });

Check.post("check-in/:id", ({ set, params }) => CheckIn(set, params));
Check.post("check-out/:id", ({ set, params }) => CheckOut(set, params));
Check.post("check-in-online/:id", ({ set, params }) =>
  CheckInOnline(set, params)
);
Check.post("check-out-online/:id", ({ set, params }) =>
  CheckOutOnline(set, params)
);
