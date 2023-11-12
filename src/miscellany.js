import { ButtonBuilder, ButtonStyle } from "discord.js";
import client from "./mainDiscord.js";

export class Miscellany {
  static embed = {
    publicSkyOrder: ({
      title,
      desc,
      startDate,
      deadLine,
      AccFreehours,
      orderId,
      price,
      express,
    }) => {
      return {
        title,
        author: {
          name: "NEW ORDER AVAILABLE",
          icon_url: client.user.avatarURL(),
        },
        description: express ? `EXPRESS || ${desc}` : desc,
        thumbnail: { url: client.user.avatarURL() },
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
            value: "$" + (price * 0.8).toFixed(1),
            inline: true,
          },
        ],
        color: 2899536,
        timestamp: new Date().toISOString(),
      };
    },
  };
  static button = {
    getOrder: (orderId, source) => {
      return new ButtonBuilder({
        custom_id: `or.${source}.${orderId}.0`,
        label: "Get Order",
        style: ButtonStyle.Primary,
      });
    },
  };
}
