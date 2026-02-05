// helpers/AllureTransport.js
const Transport = require("winston-transport");
const { allure } = require("allure-mocha/runtime");

class AllureTransport extends Transport {
  log(info, callback) {
    try {
      allure.attachment(
        `LOG (${info.level})`,
        Buffer.from(info.message, "utf8"),
        "text/plain"
      );
    } catch (e) {
      console.error("Error logging to Allure:", e);
    }
    callback();
  }
}

module.exports = AllureTransport;