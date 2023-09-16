import fs from "fs";
import { parse } from "path";
import { v4 as getUuid } from "uuid";

import type { User } from "./types/user";

export interface UsersStore {
  users: User[];
}

export const DEFAULT_USERS_STORE: UsersStore = {
  users: [],
};

export default class HelloModel {
  constructor(private usersFilePath: string) { }

  private async getUsersStore() {
    const usersStoreExists = fs.existsSync(this.usersFilePath);

    if (!usersStoreExists) {
      const store = DEFAULT_USERS_STORE;

      await fs.promises.mkdir(parse(this.usersFilePath).dir, { recursive: true });

      await fs.promises.writeFile(this.usersFilePath, JSON.stringify(store));

      return store;
    }
    const fileContentsStr = await fs.promises.readFile(
      this.usersFilePath,
      "utf-8"
    );

    const store: UsersStore = JSON.parse(fileContentsStr);

    return store;
  }

  public async getUsers() {
    const usersStore = await this.getUsersStore();

    return usersStore.users;
  }

  public async createUser(userInfo: Omit<User, "id">) {
    const store = await this.getUsersStore();

    const id = getUuid();

    const newUser = {
      ...userInfo,
      id,
    };
    store.users.push(newUser);

    await fs.promises.writeFile(this.usersFilePath, JSON.stringify(store));

    return newUser;
  }
}
