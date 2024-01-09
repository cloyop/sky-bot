import { config } from "dotenv";
import { deepReset, skyInit } from "./src/skyCoachPw.js";
import { backuper } from "./backUp/index.js";
import { discordInit } from "./src/mainDiscord.js";
config();
const start = new Date().toString();
skyInit();
discordInit();
setInterval(backuper, 43200000);
setInterval(deepReset, 7200000);
process.on("exit", () =>
  console.log("Started --> ", start, " Ended   -->", new Date().toString())
);
