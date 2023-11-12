import { config } from "dotenv";
import { deepReset, skyInit } from "./src/skyCoachPw.js";
import client from "./src/mainDiscord.js";
import { ChannelsController } from "./src/channels.js";
import { backuper } from "./backUp/index.js";

config();

client.login(process.env.TOKEN);
skyInit();
ChannelsController.init();
setInterval(async () => {
  await deepReset();
}, 3600000);
setInterval(async () => {
  backuper();
}, 43200000);
