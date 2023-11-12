import { page } from "./skyCoachPw.js";

export default async function ordersScanner(x = []) {
  try {
    return await page.evaluate((x) => {
      const findList = document.querySelector(".find-list");
      if (!findList) return null;
      const orderListItems = document.querySelectorAll(
        ".order-list-item--find"
      );
      if (orderListItems.length >= 20) {
        const loadMore = document.querySelector(
          ".load-more.button.button-dark-additional"
        );
        if (loadMore) loadMore.click();
      }
      const data = [];
      let ids = [];
      orderListItems?.forEach((el) => {
        const $ = (selector) => el.querySelector(selector);
        const $$ = (selector) => el.querySelectorAll(selector);
        const orderId = $$(".order-stats__item-value")[0]
          ?.textContent.replaceAll(" ", "")
          .replaceAll("\n", "");

        const desc =
          $(".order-list-item__desc-text")
            ?.textContent.replaceAll("  ", "")
            .replaceAll("\n", "")
            .replaceAll("\r", "") || "none";
        const GetOrderButton = $(
          ".order-list-item__controls > button.button-main"
        );
        const content = el.textContent.toLowerCase();
        const title =
          $("h3.order-list-item__row")
            ?.textContent.replaceAll("  ", "")
            .replaceAll("\n", "")
            .replaceAll("+ LEVELING", " ")
            .replaceAll("FREE LEVELING+", " ") || "none";

        const region =
          $$(".order-stats__item-value")[1]
            ?.textContent.replaceAll(" ", "")
            .replaceAll("\n", "") || "USA";
        const startDate =
          $$(".order-stats__item-value")[2]
            ?.textContent.replaceAll(" ", "")
            .replaceAll("\n", "") || "asap";
        const deadLine =
          $$(".order-stats__item-value")[3]
            ?.textContent.replaceAll(" ", "")
            .replaceAll("\n", "") || "asap";
        const AccFreehours =
          $$(".order-stats__item-value")[4]
            ?.textContent.replaceAll(" ", "")
            .replaceAll("\n", "") || "any";

        const pricesDolar =
          $(".order-list-item__order-price > span")?.textContent || "00";
        const priceCent =
          el.querySelector(
            ".order-list-item__order-price > span.order-price__cent"
          )?.textContent || "00";

        let priceInt = parseFloat(
          `${pricesDolar}.${priceCent}`.replace("$", "")
        );

        let price = priceInt;
        let categoryInt;
        const hardcoreKeyWords = title.includes("hardcore");
        const classicKeyWords =
          content.includes("classic") || content.includes("wotlk");
        const lolKeyWords =
          content.includes("lol") ||
          content.includes("placement matches") ||
          content.includes("top") ||
          content.includes(" na ") ||
          content.includes("Unranked");

        if (hardcoreKeyWords) categoryInt = 1;
        else if (classicKeyWords) categoryInt = 2;
        else if (lolKeyWords) categoryInt = 3;
        else categoryInt = 0;
        let express = content.includes("express") ? true : false;
        const orderObject = {
          category: categoryInt,
          title,
          desc,
          orderId,
          startDate,
          deadLine,
          AccFreehours,
          price,
          express,
        };
        if (GetOrderButton.classList.contains("button--disabled")) {
          findList.removeChild(el);
          return;
        }
        ids.push(orderId);
        if (x.length > 0 && x.includes(orderId)) return;
        data.push(orderObject);
      });
      console.log(data, ids);
      return [data, ids];
    }, x);
  } catch (error) {
    console.log(error);
    return [null, null];
  }
}
