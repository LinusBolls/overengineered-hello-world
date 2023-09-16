import inquirer from "inquirer";

import Lang from "./config/lang";
import type { User } from "./types/user";

export type AuthAction =
  | {
      type: "signup";
    }
  | {
      type: "signin";
      userId: string;
    };

export default class HelloView {
  constructor() {}

  public async promptUserSignin(users: User[]) {
    const signinOptions = users.map((user) => ({
      value: {
        type: "signin",
        userId: user.id,
      },
      name: user.name,
    }));
    const signupOption = {
      value: {
        type: "signup",
      },
      name: Lang.signupOption,
    };

    const prompt = {
      type: "list",
      name: "action",
      message: Lang.signinPrompt,
      choices: [...signinOptions, signupOption],
    };
    const { action } = await inquirer.prompt<{ action: AuthAction }>([prompt]);

    return action;
  }

  public async promptUserCreation(): Promise<Omit<User, "id">> {
    const { username } = await inquirer.prompt<{ username: string }>([
      {
        type: "input",
        name: "username",
        message: Lang.usernamePrompt,
      },
    ]);
    const userInfo = {
      name: username,
    };
    return userInfo;
  }

  public async greetUser(user: User) {
    console.info(Lang.userWelcome.replace(/\[username\]/g, user.name));
  }
}
