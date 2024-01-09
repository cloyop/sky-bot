import { ButtonBuilder, ButtonStyle } from "discord.js";
import { clientAvatar } from "./mainDiscord.js";
import { createRequire } from "node:module";
export const require = createRequire(import.meta.url);
const json = require("../config.json");
let priceK = json.current_price;

const calcu = (p) => (p / priceK) * 100;

export const updatePriceK = (np) => (priceK = np);

export async function repler(i, content) {
  try {
    await i.reply(content);
  } catch (error) {
    return;
  }
}

export let publicSkyOrder = ({
  title,
  desc,
  startDate,
  deadLine,
  AccFreehours,
  orderId,
  price,
  express,
}) => {
  const priceFixed = price * 0.86;
  return {
    title,
    author: {
      name: "NEW ORDER AVAILABLE",
      icon_url: clientAvatar,
    },
    description: express ? `EXPRESS || ${desc}` : desc,
    thumbnail: { url: clientAvatar },
    fields: [
      {
        name: "Start date",
        value: startDate || "any",
        inline: true,
      },
      {
        name: "Dead line",
        value: deadLine || "any",
        inline: true,
      },
      {
        name: "Acc Free hours",
        value: AccFreehours || "any",
        inline: true,
      },
      {
        name: "OrderID",
        value: orderId,
        inline: true,
      },
      {
        name: "Express Order",
        value: express,
        inline: true,
      },
      {
        name: "Price",
        value: "$" + priceFixed.toFixed(1),
        inline: true,
      },
      {
        name: "PriceOnGold",
        value: calcu(priceFixed).toFixed(1) + "K",
        inline: true,
      },
      {
        name: "Each 100k ",
        value: "$" + priceK.toFixed(1),
        inline: true,
      },
    ],
    color: 2899536,
    timestamp: new Date().toISOString(),
  };
};

export let getOrder = (orderId, source) => {
  return new ButtonBuilder({
    custom_id: `or.${source}.${orderId}.0`,
    label: "Get Order",
    style: ButtonStyle.Primary,
  });
};
