const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC03 — Guardar deshabilitado con formulario vacío", function () {
  this.timeout(0);

  const expected = { AccountName: "Test Durán" };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info(
        "\nEjecutando TC03 — Guardar deshabilitado con formulario vacío | 3 de 36\n"
      );
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("El botón Guardar debe estar deshabilitado cuando no hay datos", async () => {
    const btn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar"
    );

    const isDisabled = await global.helper.isButtonDisabled(btn);

    assert.strictEqual(isDisabled, true);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
