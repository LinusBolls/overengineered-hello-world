import HelloModel from "./HelloModel";
import HelloView from "./HelloView";
import { Logger, ScopedLogger } from "./logging";
import { User } from "./types/user";

export default class HelloController {
  private logger: Logger;

  constructor(
    private model: HelloModel,
    private view: HelloView
  ) {
    this.logger = new ScopedLogger("hello-controller");
  }

  public async startup() {
    const users = await this.model.getUsers();

    let activeUser: User;

    if (!users.length) {
      const userInfo = await this.view.promptUserCreation();

      activeUser = await this.model.createUser(userInfo);
    } else {
      const action = await this.view.promptUserSignin(users);

      if (action.type === "signup") {
        const userInfo = await this.view.promptUserCreation();

        activeUser = await this.model.createUser(userInfo);
      } else {
        activeUser = users.find((i) => i.id === action.userId)!;
      }
    }
    await this.view.greetUser(activeUser);
  }
}
