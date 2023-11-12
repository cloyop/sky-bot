import { Client } from "discord.js";
import { backuper } from "../backUp/index.js";
const client = new Client({ intents: 3276799 });
client.on("messageCreate", (m) => {
  if (
    m.author.id !== process.env.CLOYO ||
    m.guildId !== process.env.MODE_BOOST_ID ||
    m.channelId !== process.env.STAFF_CHANNEL
  )
    return;
  if (m.content === "!sw") {
    backuper();
    return;
  }
});
export default client;
