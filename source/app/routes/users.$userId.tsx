import { Form, useLoaderData, useFetcher } from "@remix-run/react";

import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { TUser } from "../API";
import invariant from "tiny-invariant";
import { getUserById, updateUser } from "../API";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, "Missing userId param");
  const formData = await request.formData();
  return updateUser(params.userId, {
    favorite: formData.get("favorite") === "true",
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userId, "Missing userId param");
  const user = await getUserById(params.userId);

  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  return { user };
};

export default function Users() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div id="user">
      <div>
        <img
          alt={`${user.firstName} ${user.lastName} avatar`}
          key={user.image}
          src={user.image}
        />
      </div>

      <div>
        <h1>
          {user.firstName || user.lastName ? (
            <>
              {user.firstName} {user.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite user={user} />
        </h1>

        {user.email ? (
          <p>
            <a href={`email:{user.email}`}>{user.email}</a>
          </p>
        ) : null}

        {user.notes ? <p>{user.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  user: Pick<TUser, "favorite">;
}> = ({ user }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : user.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
