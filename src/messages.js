import { ActionRowBuilder } from "discord.js";

import { getOrder, publicSkyOrder } from "./miscellany.js";
import { retailOrderChannel } from "./mainDiscord.js";

export let messagesOnChat = new Map();
export const messageOnChatReset = () => (messagesOnChat = new Map());

export async function newOrderMessageControl(orderObject) {
  try {
    const embed = publicSkyOrder(orderObject);
    const row = new ActionRowBuilder().addComponents(
      getOrder(orderObject.orderId, 1)
    );
    const bodyM = { embeds: [embed], components: [row] };
    let message = await retailOrderChannel.send(bodyM);
    messagesOnChat.set(orderObject.orderId, message);
    console.log("saved -> ", orderObject.orderId);
  } catch (error) {}
}
export async function takenOrderMessageControl(orderId) {
  try {
    console.log("remove ->", orderId, "-> has??", messagesOnChat.has(orderId));
    const m = messagesOnChat.get(orderId);
    await m.delete();
    messagesOnChat.delete(orderId);
  } catch (error) {
    console.log(error);
  }
}
