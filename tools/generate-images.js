const puppeteer = require("puppeteer");
const { join } = require("path");
const { promisify } = require("util");

const rimraf = promisify(require("rimraf"));

const getProp = async (element, attributeName) => {
  let attrHandle = await element.getProperty(attributeName);
  return attrHandle.jsonValue();
};

(async () => {
  // Clear all old images
  await rimraf(join(__dirname, "../images/*"));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Goto parcel server
  await page.goto("http://localhost:1234");

  // Find all named elements
  const elements = await page.$$("body *[id]");

  for (let element of elements) {
    let id = await getProp(element, "id");
    let box = await element.boundingBox();
    let { x, y, width, height } = box;
    let imagePadding = 3;

    let storeAt = join(__dirname, "..", "images", `${id}.png`);
    await element.screenshot({
      path: storeAt,
      clip: {
        x: x - imagePadding,
        y: y - imagePadding,
        width: width + imagePadding * 2,
        height: height + imagePadding * 2
      }
    });
  }
  await browser.close();
})();
