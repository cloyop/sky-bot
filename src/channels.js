import client from "./mainDiscord.js";

export let channelsMap = new Map();

export let retailOrderChannel;
export let hardcoreOrderChannel;
export let clasicOrderChannel;
export let lolOrderChannel;
export class ChannelsController {
  static async deleteAll(channel) {
    const allMessages = await channel.messages.fetch();
    allMessages?.forEach((el) => {
      try {
        el.delete();
      } catch (error) {
        return;
      }
    });
  }
  static async init() {
    try {
      const g = await client.guilds.fetch(process.env.MODE_BOOST_ID);
      const r = await g.channels.fetch(process.env.R_ORDERS_CHANNEL);
      const h = await g.channels.fetch(process.env.H_ORDERS_CHANNEL);
      const c = await g.channels.fetch(process.env.C_ORDERS_CHANNEL);
      const l = await g.channels.fetch(process.env.L_ORDERS_CHANNEL);
      this.deleteAll(r);
      this.deleteAll(h);
      this.deleteAll(c);
      this.deleteAll(l);
      retailOrderChannel = r;
      hardcoreOrderChannel = h;
      clasicOrderChannel = c;
      lolOrderChannel = l;
    } catch (error) {}
  }
}
