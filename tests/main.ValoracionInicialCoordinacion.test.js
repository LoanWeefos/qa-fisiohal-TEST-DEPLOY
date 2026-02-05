require("allure-mocha");

const loginJwt = require("../helpers/loginJwt.js");
const browser = require("../helpers/browser.js");
const logger = require("../helpers/logger.js");

describe("📘 FEATURE — Valoración Inicial - Instancia Salesforce", function () {
  this.timeout(0);

  before(async () => {
    global.__runningAll = true;
    logger.info("Login Coordinación");

    const driver = await loginJwt(
      "/lightning/o/Account/list?filterName=__Recent",
      "ehaiden@fisiohal.com.partial"
    );

    global.driver = driver;
    global.helper = new browser(driver);
    logger.info("FEATURE — Valoración Inicial - Instancia Salesforce - Coordinación");
  });

  require("./ValoracionInicial/TC11.test.js");
  require("./ValoracionInicial/TC15.test.js");
  require("./ValoracionInicial/TC18.3.test.js");
  require("./ValoracionInicial/TC23.test.js");
  require("./ValoracionInicial/TC24.test.js");
  require("./ValoracionInicial/TC104.test.js");

  after(async () => {
    logger.info("Cerrando navegador");
    if (global.driver) {
      await global.driver.quit();
    }
    global.__runningAll = false;
  });
});
