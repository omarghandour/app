import Elysia from "elysia";
import {
  CheckIn,
  CheckInOnline,
  CheckOut,
  CheckOutOnline,
} from "../controllers/CheckInOutController";

export const Check = new Elysia({ prefix: "/check" });

Check.post("check-in/:id", ({ set, params, jwt }: any) =>
  CheckIn(set, params, jwt)
);
Check.post("check-out/:id", ({ set, params, jwt }: any) =>
  CheckOut(set, params, jwt)
);
Check.post("check-in-online/:id", ({ set, params, jwt }: any) =>
  CheckInOnline(set, params, jwt)
);
Check.post("check-out-online/:id", ({ set, params, jwt }: any) =>
  CheckOutOnline(set, params, jwt)
);
