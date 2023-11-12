import { ActionRowBuilder } from "discord.js";
import {
  clasicOrderChannel,
  hardcoreOrderChannel,
  lolOrderChannel,
  retailOrderChannel,
} from "./channels.js";
import { Miscellany } from "./miscellany.js";

export let messagesMap = new Map();
export let messagesOnChat = new Map();
export class MessageController {
  static async newOrderMessageControl(orderObject) {
    try {
      const embed = Miscellany.embed.publicSkyOrder(orderObject);
      const row = new ActionRowBuilder().addComponents(
        Miscellany.button.getOrder(orderObject.orderId, 1)
      );
      const bodyM = { embeds: [embed], components: [row] };
      let message;
      if (orderObject.category === 0) {
        message = await retailOrderChannel.send(bodyM);
      }
      if (orderObject.category === 1) {
        message = await hardcoreOrderChannel.send(bodyM);
      }
      if (orderObject.category === 2) {
        message = await clasicOrderChannel.send(bodyM);
      }
      if (orderObject.category === 3) {
        message = await lolOrderChannel.send(bodyM);
      }

      const se = messagesOnChat.set(orderObject.orderId, message);
      console.log("saved -> ", orderObject.orderId);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
  static async TakenOrderMessageControl(orderId) {
    try {
      console.log(
        "remove ->",
        orderId,
        "-> has??",
        messagesOnChat.has(orderId)
      );
      if (!messagesOnChat.has(orderId)) return;
      const m = messagesOnChat.get(orderId);
      await m.delete();
      messagesOnChat.delete(orderId);

      return;
    } catch (error) {
      return;
    }
  }
}
