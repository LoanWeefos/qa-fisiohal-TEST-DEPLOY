const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC14 — Validar cuenta autocompletada en Agenda Cita", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC14 — Validar cuenta autocompletada en Agenda Cita | 14 de 50\n");
    }
    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe mostrar la cuenta seleccionada en Parent Record", async () => {
    const inputXpath =
      "//input[@role='combobox' and starts-with(@id,'combobox-input-') and (@readonly='true' or @aria-readonly='true')]";

    const input = await global.helper.findOrFail(
      inputXpath,
      "Input Parent Record"
    );

    const dataValue = (await input.getAttribute("data-value"))?.trim() || "";
    const placeholder = (await input.getAttribute("placeholder"))?.trim() || "";

    const visible = dataValue || placeholder;

    assert.strictEqual(
      visible,
      "TEST TEST",
      `Parent Record no coincide. data-value="${dataValue}" placeholder="${placeholder}"`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
