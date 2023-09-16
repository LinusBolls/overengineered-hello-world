import Path from "./config/paths";
import HelloController from "./HelloController";
import HelloModel from "./HelloModel";
import HelloView from "./HelloView";

async function main() {
  const model = new HelloModel(Path.usersSaveFile);
  const view = new HelloView();

  const controller = new HelloController(model, view);

  await controller.startup();
}
main();
