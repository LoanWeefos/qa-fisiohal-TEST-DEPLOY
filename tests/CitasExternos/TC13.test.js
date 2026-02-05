const assert = require("assert");
const { By, until } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC13 — Abrir Agenda Cita", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt("/lightning/o/Account/list?filterName=__Recent");
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC13 — Abrir Agenda Cita | 13 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe abrir el modal Agenda Cita", async () => {
    const header = await global.helper.findOrFail(
      "//h2[normalize-space()='Agenda Cita']",
      "Header Agenda Cita"
    );

    assert.ok(header);
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
