const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC12 — Mostrar botón Agenda Cita", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt("/lightning/o/Account/list?filterName=__Recent");
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC12 — Mostrar botón Agenda Cita | 12 de 50\n");
    }
    await global.helper.goToAccount("TEST TEST");
    await global.driver.sleep(1200);
  });

  it("Debe mostrarse el botón 'Agenda Cita'", async () => {
    const buttonCita = await global.helper.findOrFail(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );

    assert.ok(buttonCita);
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
