import { chromium } from "playwright";
import ordersScanner from "./scanner.js";
import {
  takenOrderMessageControl,
  newOrderMessageControl,
  messageOnChatReset,
} from "./messages.js";
import { retailOrderChannel } from "./mainDiscord.js";
export let allOrdersMap = new Map();
export let loopSwich = 1;
let activeOrdersMap = new Map();
let page;
let browser;

export async function skyInit() {
  const br = await chromium.launch({ headless: false });
  page = await br.newPage();
  try {
    await page.goto(process.env.URL_FIND, { timeout: 0 });
    await page
      .getByPlaceholder("Email", { exact: true })
      .fill(process.env.MAIL);
    await page.getByPlaceholder("Password").fill(process.env.PWD);
    await page.locator("form").getByRole("button", { name: "Sign In" }).click();
    setTimeout(loopScanner, 25000);
    browser = br;
  } catch (error) {
    console.log("ScPW");
    console.log(error);
  }
}
export async function loopScanner() {
  if (loopSwich === 0) return;
  const ids = Array.from(activeOrdersMap.keys());
  try {
    const [data, activeIDs] = await ordersScanner(page, ids);

    if (data === null || activeIDs === null) return loopScanner();

    const idsTaken = ids.filter((el) => !activeIDs.includes(el));
    data?.forEach((element) => {
      if (!activeOrdersMap.has(element.orderId)) {
        activeOrdersMap.set(element.orderId, element);
        allOrdersMap.set(element.orderId, element);
        newOrderMessageControl(element);
      }
    });
    idsTaken?.forEach((element) => {
      activeOrdersMap.delete(element);
      takenOrderMessageControl(element);
    });
  } catch (error) {
    console.log(error, "good To Know");
  } finally {
    loopScanner();
  }
}
export async function deepReset() {
  try {
    await browser.close();
    console.log("Browser Closed");
    loopSwich = 0;
    activeOrdersMap = new Map();
    await retailOrderChannel.bulkDelete(100);
    messageOnChatReset();
    loopSwich = 1;
    console.log("Params Reseted");
    browser = await skyInit();
    console.log("Browser Opened");
  } catch (error) {
    console.log(`error reseting ******${error}******`);
  }
}
