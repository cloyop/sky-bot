import { Client } from "discord.js";
import { backuper } from "../backUp/index.js";
import { repler, updatePriceK } from "./miscellany.js";
import { writeFile } from "node:fs/promises";
import { deepReset } from "./skyCoachPw.js";
export let retailOrderChannel;
export let clientAvatar;
const client = new Client({ intents: 3276799 });
let counter = 0;
client.on("messageCreate", async (m) => {
  if (
    m.guildId !== process.env.MODE_BOOST_ID ||
    (m.author.id !== process.env.ALYS && m.author.id !== process.env.CL)
  )
    return;
  let msg = m.content.toLowerCase();

  if (msg === "!sw") return backuper();

  if (msg === "!cls") return bulkDelete(m.channel);

  if (msg.startsWith("!dr"))
    return msg.includes("-h") ? deepReset(false) : deepReset();
});
client.on("interactionCreate", async (i) => {
  try {
    if (i.isChatInputCommand()) {
      if (counter !== 0)
        return repler(i, `Recien usado, awanta ${counter} segundos`);
      if (i.commandName === "new_price") {
        const quantity = i.options.get("amount")?.value || null;

        if (quantity === null) return repler(i, "Invalid Params");
        const quantityr = quantity.replace(",", ".");
        const priceParse = quantityr * 1;
        updatePriceK(priceParse);
        const newJason = {
          current_price: priceParse,
        };
        await writeFile(`config.json`, JSON.stringify(newJason));
        counter = 60;
        let thisInt = setInterval(() => {
          counter--;
          if (counter === 0) {
            clearInterval(thisInt);
          }
        }, 1000);
        repler(
          i,
          `Updated ${quantity} by ${
            i.user.globalName || i.user.username || "Quien Carajos Eres"
          }`
        );
        deepReset();
      }
    }
  } catch (error) {
    console.log(error);
  }
});
export let discordInit = async () => {
  try {
    await client.login(process.env.TOKEN);
    clientAvatar = client.user.avatarURL();
    const guild = await client.guilds.fetch(process.env.MODE_BOOST_ID);
    retailOrderChannel = await guild.channels.fetch(
      process.env.R_ORDERS_CHANNEL
    );
    await retailOrderChannel.bulkDelete(100);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export let bulkDelete = async (channel, quantity = 100) => {
  try {
    await channel.bulkDelete(quantity);
  } catch (error) {}
};
