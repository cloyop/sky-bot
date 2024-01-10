import { chromium } from "playwright";
import ordersScanner from "./scanner.js";
import {
  takenOrderMessageControl,
  newOrderMessageControl,
  messageOnChatReset,
} from "./messages.js";
import { bulkDelete, retailOrderChannel } from "./mainDiscord.js";
export let allOrdersMap = new Map();
export let loopSwich = 1;
let activeOrdersMap = new Map();
let page;
let browser;

export async function skyInit(h = true) {
  browser = await chromium.launch({ headless: h });
  page = await browser.newPage();

  try {
    await page.goto(process.env.URL_FIND, { timeout: 0 });
    await page
      .getByPlaceholder("Email", { exact: true })
      .fill(process.env.MAIL);
    await page.getByPlaceholder("Password").fill(process.env.PWD);
    await page.locator("form").getByRole("button", { name: "Sign In" }).click();
    setTimeout(loopScanner, 25000);
  } catch (error) {
    console.log("ScPW");
    console.log(error);
  }
}
export async function loopScanner() {
  if (loopSwich === 1) {
    const ids = Array.from(activeOrdersMap.keys());
    const [data, activeIDs] = await ordersScanner(page, ids);
    if (data !== null || activeIDs !== null) {
      const idsTaken = ids?.filter((el) => !activeIDs.includes(el));
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
    }
  }
  setTimeout(loopScanner, 2500);
}
export async function deepReset(h = true) {
  try {
    ("*******Deep Reset*******");
    await browser.close();
    console.log("Browser Closed");
    loopSwich = 0;
    activeOrdersMap = new Map();
    bulkDelete(retailOrderChannel);
    messageOnChatReset();
    loopSwich = 1;
    console.log("Params Reseted");
    await skyInit(h);
    console.log("Browser Opened");
    ("*******Reseted successfully*******");
  } catch (error) {
    console.log(`Error Reseting ******${error}******`);
    deepReset();
  }
}
export let pageReload = async () => {
  try {
    loopSwich = 0;
    await page.reload();
    loopSwich = 1;
    loopScanner();
  } catch (error) {
    console.log("Page Reload??");
    console.log(error);
    deepReset();
  }
};
