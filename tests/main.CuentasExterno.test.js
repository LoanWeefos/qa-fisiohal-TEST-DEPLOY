require("allure-mocha");

const loginJwt = require("../helpers/loginJwt.js");
const browser = require("../helpers/browser.js");
const logger = require("../helpers/logger.js");

describe("📘 FEATURE — Crear Cuentas Externo", function () {
  this.timeout(0);

  before(async () => {
    global.__runningAll = true;

    const driver = await loginJwt(
      "/lightning/o/Account/list?filterName=__Recent"
    );
    global.driver = driver;
    global.helper = new browser(driver);
    logger.info("FEATURE — Crear Cuentas Externo\n");
  });

  require("./CuentasExternos/TC01.test.js");
  require("./CuentasExternos/TC02.test.js");
  require("./CuentasExternos/TC03.test.js");
  require("./CuentasExternos/TC04.test.js");
  require("./CuentasExternos/TC05.test.js");
  require("./CuentasExternos/TC06.test.js");
  require("./CuentasExternos/TC07.test.js");
  require("./CuentasExternos/TC08.test.js");
  require("./CuentasExternos/TC09.test.js");
  require("./CuentasExternos/TC10.test.js");
  require("./CuentasExternos/TC11.test.js");

  after(async () => {
    logger.info("Cerrando navegador");

    if (global.driver) {
      await global.driver.quit();
    }

    global.__runningAll = false;
  });
});
