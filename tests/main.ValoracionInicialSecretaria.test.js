require("allure-mocha");

const loginJwt = require("../helpers/loginJwt.js");
const browser = require("../helpers/browser.js");
const logger = require("../helpers/logger.js");

describe("📘 FEATURE — Valoración Inicial - Instancia Salesforce", function () {
  this.timeout(0);

  before(async () => {
    global.__runningAll = true;
    logger.info("Login Secretaria");

    const driver = await loginJwt(
      "/lightning/o/Account/list?filterName=__Recent",
      "delgadober05@gmail.com.partial"
    );

    global.driver = driver;
    global.helper = new browser(driver);
    logger.info("FEATURE — Valoración Inicial - Instancia Salesforce - Secretaria\n");
  });

  require("./ValoracionInicial/TC04.test.js");
  require("./ValoracionInicial/TC05.test.js");
  require("./ValoracionInicial/TC07.test.js");
  require("./ValoracionInicial/TC09.test.js");
  require("./ValoracionInicial/TC12.test.js");
  require("./ValoracionInicial/TC14.test.js");
  require("./ValoracionInicial/TC16.test.js");
  require("./ValoracionInicial/TC17.test.js");
  require("./ValoracionInicial/TC18.2.test.js");
  require("./ValoracionInicial/TC20.test.js");
  require("./ValoracionInicial/TC21.test.js");
  require("./ValoracionInicial/TC25.test.js");
  require("./ValoracionInicial/TC103.test.js");
  require("./ValoracionInicial/TC105.test.js");

  after(async () => {
    logger.info("Cerrando navegador");
    if (global.driver) {
      await global.driver.quit();
    }
    global.__runningAll = false;
  });
});
