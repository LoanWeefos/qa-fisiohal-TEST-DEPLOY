const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC19 — Bloqueo sin terapias", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
    Area: "Piso 1",
    Day: "29",
    MonthLabel: "December",
    Year: "2025",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC19 — Bloqueo sin terapias | 19 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe mantener Guardar deshabilitado si no se agregan terapias", async () => {
    await global.helper.selectFrequency(expected.Frequency);
    await global.helper.setDate(
      expected.Day,
      expected.MonthLabel,
      expected.Year
    );
    await global.helper.selectArea(expected.Area);

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar"
    );

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);

    assert.strictEqual(
      isDisabled,
      true,
      "Guardar debería estar deshabilitado si no se agregan terapias."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
