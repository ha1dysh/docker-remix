import { matchSorter } from "match-sorter";

export type TUser = {
  id?: number;
  firstName?: string;
  lastName?: string;
  image?: string;
  email?: string;
  notes?: string;
  favorite?: boolean;
}

const BASE_URL = 'https://dummyjson.com/users/'

export async function getUsers(query: string): Promise<TUser[]> {
  const res = await fetch(BASE_URL)
  const { users } = await res.json()

  const sortedUsers: TUser[] = matchSorter(users, query, {
    keys: ["firstName"],
  });

  return sortedUsers
}

export async function getUserById(id: string): Promise<TUser> {
  const res = await fetch(BASE_URL + id)
  const user  = await res.json()
  return user
}

export async function createUser(user: TUser): Promise<TUser> {
  const res = await fetch(BASE_URL + 'add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user })
  })
  const createdUser = await res.json()
  return createdUser
}

export async function updateUser(id: string, data: TUser) {
  const res = await fetch(BASE_URL + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data })
  })
  const updatedUser = await res.json()
  return updatedUser
}

export async function deleteUser(id: string) {
  const res = await fetch(BASE_URL + id, { method: 'DELETE', })
  const deletedUser = await res.json()
  return deletedUser
}
