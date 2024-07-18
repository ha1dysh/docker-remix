import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getUserById, updateUser } from "../API";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, "Missing userId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateUser(params.userId, updates);
  return redirect(`/users/${params.userId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userId, "Missing userId param");
  const user = await getUserById(params.userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return { user };
};

export default function EditUser() {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  console.log("edit test");

  return (
    <Form key={user.id} id="user-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={user.firstName}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={user.lastName}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Email</span>
        <input
          defaultValue={user.email}
          name="Email"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={user.image}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={user.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
