require("allure-mocha");

const loginJwt = require("../helpers/loginJwt.js");
const browser = require("../helpers/browser.js");
const logger = require("../helpers/logger.js");

describe("📘 FEATURE — Valoración Inicial - Instancia Salesforce", function () {
  this.timeout(0);

  before(async () => {
    global.__runningAll = true;
    logger.info("Login Terapeuta");

    const driver = await loginJwt(
      "/lightning/o/Account/list?filterName=__Recent",
      "berthabahan@gmail.com.partial"
    );

    global.driver = driver;
    global.helper = new browser(driver);
    logger.info("FEATURE — Valoración Inicial - Instancia Salesforce - Terapeuta\n");
  });

  require("./ValoracionInicial/TC01.test.js");
  require("./ValoracionInicial/TC02.test.js");
  require("./ValoracionInicial/TC03.test.js");
  require("./ValoracionInicial/TC06.test.js");
  require("./ValoracionInicial/TC08.test.js");
  require("./ValoracionInicial/TC10.test.js");
  require("./ValoracionInicial/TC13.test.js");
  require("./ValoracionInicial/TC18.1.test.js");
  require("./ValoracionInicial/TC19.test.js");
  require("./ValoracionInicial/TC22.test.js");
  require("./ValoracionInicial/TC26.test.js");
  require("./ValoracionInicial/TC27.test.js");
  require("./ValoracionInicial/TC28.test.js");
  require("./ValoracionInicial/TC29.test.js");
  require("./ValoracionInicial/TC30.test.js");
  require("./ValoracionInicial/TC31.test.js");
  require("./ValoracionInicial/TC32.test.js");
  require("./ValoracionInicial/TC33.test.js");
  require("./ValoracionInicial/TC34.test.js");
  require("./ValoracionInicial/TC35.test.js");
  require("./ValoracionInicial/TC36.test.js");
  require("./ValoracionInicial/TC37.test.js");
  require("./ValoracionInicial/TC38.test.js");
  require("./ValoracionInicial/TC39.test.js");
  require("./ValoracionInicial/TC40.test.js");
  require("./ValoracionInicial/TC41.test.js");
  require("./ValoracionInicial/TC42.test.js");
  require("./ValoracionInicial/TC43.test.js");
  require("./ValoracionInicial/TC44.test.js");
  require("./ValoracionInicial/TC45.test.js");
  require("./ValoracionInicial/TC46.test.js");
  require("./ValoracionInicial/TC47.test.js");
  require("./ValoracionInicial/TC48.test.js");
  require("./ValoracionInicial/TC49.test.js");
  require("./ValoracionInicial/TC50.test.js");
  require("./ValoracionInicial/TC51.test.js");
  require("./ValoracionInicial/TC52.test.js");
  require("./ValoracionInicial/TC53.test.js");
  require("./ValoracionInicial/TC54.test.js");
  require("./ValoracionInicial/TC55.test.js");
  require("./ValoracionInicial/TC56.test.js");
  require("./ValoracionInicial/TC57.test.js");
  require("./ValoracionInicial/TC58.test.js");
  require("./ValoracionInicial/TC59.test.js");
  require("./ValoracionInicial/TC60.test.js");
  require("./ValoracionInicial/TC61.test.js");
  require("./ValoracionInicial/TC62.test.js");
  require("./ValoracionInicial/TC63.test.js");
  require("./ValoracionInicial/TC64.test.js");
  require("./ValoracionInicial/TC65.test.js");
  require("./ValoracionInicial/TC66.test.js");
  require("./ValoracionInicial/TC67.test.js");
  require("./ValoracionInicial/TC68.test.js");
  require("./ValoracionInicial/TC69.test.js");
  require("./ValoracionInicial/TC70.test.js");
  require("./ValoracionInicial/TC71.test.js");
  require("./ValoracionInicial/TC72.test.js");
  require("./ValoracionInicial/TC73.test.js");
  require("./ValoracionInicial/TC74.test.js");
  require("./ValoracionInicial/TC75.test.js");
  require("./ValoracionInicial/TC76.test.js");
  require("./ValoracionInicial/TC77.test.js");
  require("./ValoracionInicial/TC78.test.js");
  require("./ValoracionInicial/TC79.test.js");
  require("./ValoracionInicial/TC80.test.js");
  require("./ValoracionInicial/TC81.test.js");
  require("./ValoracionInicial/TC82.test.js");
  require("./ValoracionInicial/TC83.test.js");
  require("./ValoracionInicial/TC84.test.js");
  require("./ValoracionInicial/TC85.test.js");
  require("./ValoracionInicial/TC86.test.js");
  require("./ValoracionInicial/TC87.test.js");
  require("./ValoracionInicial/TC88.test.js");
  require("./ValoracionInicial/TC89.test.js");
  require("./ValoracionInicial/TC90.test.js");
  require("./ValoracionInicial/TC91.test.js");
  require("./ValoracionInicial/TC92.test.js");
  require("./ValoracionInicial/TC93.test.js");
  require("./ValoracionInicial/TC94.test.js");
  require("./ValoracionInicial/TC95.test.js");
  require("./ValoracionInicial/TC96.test.js");
  require("./ValoracionInicial/TC97.test.js");
  require("./ValoracionInicial/TC98.test.js");
  require("./ValoracionInicial/TC99.test.js");
  require("./ValoracionInicial/TC100.test.js");
  require("./ValoracionInicial/TC101.test.js");
  require("./ValoracionInicial/TC102.test.js");

  after(async () => {
    logger.info("Cerrando navegador");
    if (global.driver) {
      await global.driver.quit();
    }
    global.__runningAll = false;
  });

});
