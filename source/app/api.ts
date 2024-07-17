import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

const BASE_URL = 'https://dummyjson.com/users/'

type ContactMutation = {
  id?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  email?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
};

let fakeUsers: [] | ContactRecord[] = []

const fetchUsers = {

  async getAll(): Promise<ContactRecord[]> {
    const res = await fetch(BASE_URL)
    const { users } = await res.json()
    fakeUsers = users
    return fakeUsers
  },

  async getById(id: string): Promise<ContactRecord | null> {
    const res = await fetch(BASE_URL + id)
    const user = await res.json()
    return user
  },

  create(values: ContactMutation): ContactRecord {
      const id = Math.random().toString(36).substring(2, 9);
      const newContact = { id, ...values };
      fakeUsers.push(newContact);

      return newContact;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = fakeUsers.find(user => user.id === id)
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeUsers.map(u => u.id === id ? updatedContact : u)
    return updatedContact;
  },

  // destroy(id: string): null {
  //   delete fetchUsers.records[id];
  //   return null;
  // },
};

export async function getUsers(query?: string | null) {
  let contacts = await fetchUsers.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["firstName"],
    });
  }
  return contacts.sort(sortBy("firstName"));
}

export async function createEmptyContact() {
  const contact = await fetchUsers.create({});
  return contact;
}

export async function getContactById(id: string) {
  const user = await fetchUsers.getById(id)
  return user
}

export async function updateContact(id: string, updates: ContactMutation) {
  console.log(fakeUsers);

  const contact = fakeUsers.find(user => {
    return user.id === id
  })

  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fetchUsers.set(id, { ...contact, ...updates });
  return contact;
}

// export async function deleteContact(id: string) {
//   fetchUsers.destroy(id);
// }
