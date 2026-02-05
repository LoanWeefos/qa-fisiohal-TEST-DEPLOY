const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC18 — Error al agregar terapia sin seleccionar área", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Frequency: "Del día",
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
      logger.info("\nEjecutando TC18 — Error al agregar terapia sin seleccionar área | 18 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe deshabilitar 'Agregar' si no se seleccionó un área", async () => {
    await global.helper.findOrFail(
      "//button[@name='therapy']",
      "Botón selector de Terapia"
    );
    await global.helper.safeFindAndClick(
      "//button[@name='therapy']",
      "Botón selector de Terapia"
    );
    await global.driver.sleep(300);

    const addBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Agregar']",
      "Botón Agregar"
    );

    const isDisabled = await global.helper.isButtonDisabled(addBtn);

    assert.strictEqual(
      isDisabled,
      true,
      "El botón 'Agregar' debería estar deshabilitado si no se seleccionó un área."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
