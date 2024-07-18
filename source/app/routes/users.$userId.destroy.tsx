import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteUser } from "../API";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.userId, "Missing userId param");
  await deleteUser(params.userId);
  return redirect("/");
};
