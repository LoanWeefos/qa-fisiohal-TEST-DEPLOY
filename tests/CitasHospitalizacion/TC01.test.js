const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC01 — Botón Crear Citas Hospitalización", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC01 — Botón Crear Citas Hospitalización | 1 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
  });

  it("Debe existir el botón 'Crear Citas Hospitalización' en la cuenta", async () => {
    const btnXpath =
      "//button[contains(.,'Crear Citas Hospitalizacion') or contains(.,'Crear Citas Hospitalización')]";

    const btnExists = await global.helper.findOrFail(
      btnXpath,
      "Botón Crear Citas Hospitalización - Debe existir un botón para crear citas de hospitalización en la página de cuenta"
    );

    assert.strictEqual(
      btnExists !== null,
      true,
      "No se encontró el botón 'Crear Citas Hospitalización' en la página de la Cuenta."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
