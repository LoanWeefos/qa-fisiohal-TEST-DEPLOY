require("allure-mocha");

const loginJwt = require("../helpers/loginJwt.js");
const browser = require("../helpers/browser.js");
const logger = require("../helpers/logger.js");

describe("📘 FEATURE — Agendamiento Manual Externo", function () {
  this.timeout(0);

  before(async () => {
    global.__runningAll = true;

    const driver = await loginJwt("/lightning/o/Account/list?filterName=__Recent");
    global.driver = driver;
    global.helper = new browser(driver);
    logger.info("FEATURE — Agendamiento Manual Externo\n");
  });

  require("./CitasExternos/TC12.test.js");
  require("./CitasExternos/TC13.test.js");
  require("./CitasExternos/TC14.test.js");
  require("./CitasExternos/TC15.test.js");
  require("./CitasExternos/TC16.test.js");
  require("./CitasExternos/TC17.test.js");
  require("./CitasExternos/TC18.test.js");
  require("./CitasExternos/TC19.test.js");
  require("./CitasExternos/TC20.test.js");
  require("./CitasExternos/TC21.test.js");
  require("./CitasExternos/TC22.test.js");
  require("./CitasExternos/TC23.test.js");
  require("./CitasExternos/TC24.test.js");
  require("./CitasExternos/TC25.test.js");
  require("./CitasExternos/TC26.test.js");
  require("./CitasExternos/TC27.test.js");
  require("./CitasExternos/TC28.test.js");
  require("./CitasExternos/TC29.test.js");
  require("./CitasExternos/TC30.test.js");
  require("./CitasExternos/TC31.test.js");
  require("./CitasExternos/TC32.test.js");
  require("./CitasExternos/TC33.test.js");
  require("./CitasExternos/TC34.test.js");
  require("./CitasExternos/TC35.test.js");
  require("./CitasExternos/TC36.test.js");
  require("./CitasExternos/TC37.test.js");
  require("./CitasExternos/TC38.test.js");
  require("./CitasExternos/TC39.test.js");
  require("./CitasExternos/TC40.test.js");
  require("./CitasExternos/TC41.test.js");
  require("./CitasExternos/TC42.test.js");
  require("./CitasExternos/TC43.test.js");
  require("./CitasExternos/TC44.test.js");
  require("./CitasExternos/TC45.test.js");
  require("./CitasExternos/TC46.test.js");
  require("./CitasExternos/TC47.test.js");
  require("./CitasExternos/TC48.test.js");
  require("./CitasExternos/TC49.test.js");
  require("./CitasExternos/TC50.test.js");

  // TEST QUE NO ESTAN EN ESTE FLUJO
  // require("./CitasExternos/TC50-no.test.js");
  // require("./CitasExternos/TC51-no.test.js");
  // require("./CitasExternos/TC52-no.test.js");
  // require("./CitasExternos/TC53-no.test.js");
  // require("./CitasExternos/TC54-no.test.js");
  // require("./CitasExternos/TC55-no.test.js");
  // require("./CitasExternos/TC56-no.test.js");

  after(async () => {
    logger.info("Cerrando navegador");

    if (global.driver) {
      await global.driver.quit();
    }

    global.__runningAll = false;
  });
});
