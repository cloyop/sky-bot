import { chromium } from "playwright";
import ordersScanner from "./scanner.js";
import { MessageController } from "./messages.js";
import {
  ChannelsController,
  clasicOrderChannel,
  hardcoreOrderChannel,
  lolOrderChannel,
  retailOrderChannel,
} from "./channels.js";
const skyUrlProFind = "https://skycoach.gg/pro/find";
export let activeOrdersMap = new Map();
export let allOrdersMap = new Map();
const browser = await chromium.launch();
export const page = await browser.newPage({
  screen: { width: 1440, height: 1050 },
  viewport: { width: 1440, height: 1050 },
});
export let loopSwich;
let int;
export async function skyInit() {
  loopSwich = 1;
  try {
    if (!page.url().startsWith("https://skycoach.gg/pro/find")) {
      await page.goto(skyUrlProFind, { timeout: 0 });
      await page
        .getByPlaceholder("Email", { exact: true })
        .fill(process.env.MAIL);
      await page.getByPlaceholder("Password").fill(process.env.PWD);
      await page
        .locator("form")
        .getByRole("button", { name: "Sign In" })
        .click();
    }
    setTimeout(() => {
      loopScanner();
      int = setInterval(async () => {
        if (loopSwich === 1) {
          resetLoop();
        }
      }, 120000);
    }, 25000);
  } catch (error) {
    console.log(error);
  }
}
async function loopScanner() {
  if (loopSwich === 0) return;
  const ids = [];
  for (const key of activeOrdersMap.keys()) {
    ids.push(key);
  }

  try {
    const [data, activeIDs] = await ordersScanner(ids);
    if (data === null && activeIDs === null) throw Error("Nulls");
    const idsTaken = ids.filter((el) => !activeIDs.includes(el));
    data?.forEach((element) => {
      if (!activeOrdersMap.has(element.orderId)) {
        activeOrdersMap.set(element.orderId, element);
        allOrdersMap.set(element.orderId, element);
        MessageController.newOrderMessageControl(element);
      }
    });
    idsTaken?.forEach((element) => {
      activeOrdersMap.delete(element);
      MessageController.TakenOrderMessageControl(element);
    });
    setTimeout(() => loopScanner(), 500);
  } catch (error) {
    setTimeout(() => loopScanner(), 500);
  }
}
function scannerSwich() {
  if (loopSwich === 1) return (loopSwich = 0);
  loopSwich = 1;
  loopScanner();
}
function resetLoop() {
  try {
    loopSwich = 0;
    page.reload({ timeout: 0 }).then(() => {
      loopSwich = 1;
      loopScanner();
    });
  } catch (error) {
    console.log(`error reseting loop ***${error}***`);
  }
}
export async function deepReset() {
  try {
    if (loopSwich !== 1) return;
    loopSwich = 0;
    clearInterval(int);
    activeOrdersMap = new Map();
    await ChannelsController.deleteAll(retailOrderChannel);
    await ChannelsController.deleteAll(hardcoreOrderChannel);
    await ChannelsController.deleteAll(clasicOrderChannel);
    await ChannelsController.deleteAll(lolOrderChannel);
    skyInit();
  } catch (error) {
    console.log(`error reseting loop ***${error}***`);
  }
}
