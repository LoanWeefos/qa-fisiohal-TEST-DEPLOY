require("allure-mocha");

const loginJwt = require("../helpers/loginJwt");
const browser = require("../helpers/browser.js");
const logger = require("../helpers/logger");

describe("📘 FEATURE — Agendamiento Automatico Hospitalizacion", function () {
  this.timeout(0);

  before(async () => {
    global.__runningAll = true;

    const driver = await loginJwt("/lightning/o/Account/list?filterName=__Recent");
    global.driver = driver;
    global.helper = new browser(driver);
    logger.info("FEATURE — Agendamiento Automatico Hospitalizacion");
  });

  require("./CitasHospitalizacion/TC01.test.js");
  require("./CitasHospitalizacion/TC02.test.js");
  require("./CitasHospitalizacion/TC03.test.js");
  require("./CitasHospitalizacion/TC04.test.js");
  require("./CitasHospitalizacion/TC05.test.js");
  require("./CitasHospitalizacion/TC06.test.js");
  require("./CitasHospitalizacion/TC07.test.js");
  require("./CitasHospitalizacion/TC08.test.js");
  require("./CitasHospitalizacion/TC09.test.js");
  require("./CitasHospitalizacion/TC10.test.js");
  require("./CitasHospitalizacion/TC11.test.js");
  require("./CitasHospitalizacion/TC12.test.js");
  require("./CitasHospitalizacion/TC13.test.js");
  require("./CitasHospitalizacion/TC14.test.js");
  require("./CitasHospitalizacion/TC15.test.js");
  require("./CitasHospitalizacion/TC16.test.js");
  require("./CitasHospitalizacion/TC17.test.js");
  require("./CitasHospitalizacion/TC18.test.js");
  require("./CitasHospitalizacion/TC19.test.js");
  require("./CitasHospitalizacion/TC20.test.js");
  require("./CitasHospitalizacion/TC21.test.js");
  require("./CitasHospitalizacion/TC22.test.js");
  require("./CitasHospitalizacion/TC23.test.js");
  require("./CitasHospitalizacion/TC24.test.js");
  require("./CitasHospitalizacion/TC25.test.js");
  require("./CitasHospitalizacion/TC26.test.js");
  require("./CitasHospitalizacion/TC27.test.js");
  require("./CitasHospitalizacion/TC28.test.js");
  require("./CitasHospitalizacion/TC29.test.js");
  require("./CitasHospitalizacion/TC30.test.js");
  require("./CitasHospitalizacion/TC31.test.js");
  require("./CitasHospitalizacion/TC32.test.js");
  require("./CitasHospitalizacion/TC33.test.js");
  require("./CitasHospitalizacion/TC34.test.js");
  require("./CitasHospitalizacion/TC35.test.js");
  require("./CitasHospitalizacion/TC36.test.js");

  after(async () => {
    logger.info("Cerrando navegador");

    if (global.driver) {
      await global.driver.quit();
    }

    global.__runningAll = false;
  });
});
