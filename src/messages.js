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
    deleteIf(orderObject.orderId);
    let message = await retailOrderChannel.send(bodyM);
    messagesOnChat.set(orderObject.orderId, message);
    console.log(
      "Order Send ->> OrderId:",
      orderObject.orderId,
      "DiscordMessageID:",
      message?.id,
      " Saved? ->>",
      messagesOnChat.has(orderObject.orderId)
    );
  } catch (error) {}
}
export async function takenOrderMessageControl(orderId) {
  try {
    const m = messagesOnChat.get(orderId);
    console.log(
      "remove ->",
      orderId,
      "-> has??",
      messagesOnChat.delete(orderId)
    );
    await m.delete();
  } catch (error) {}
}

const deleteIf = async (orderId) => {
  let m = messagesOnChat.get(orderId);
  if (m != undefined) {
    try {
      await m.delete();
    } catch (error) {}
  }
};
