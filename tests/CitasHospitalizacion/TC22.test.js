const assert = require("assert");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC22 — Validar agregar sin terapia seleccionada", function () {
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
      logger.info("\nEjecutando TC22 — Validar agregar sin terapia seleccionada | 22 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("No debe permitir agregar terapia sin seleccionar una", async () => {
    const addBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Agregar']",
      "Botón Agregar - Debe existir un botón 'Agregar' para añadir terapias en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(addBtn);

    assert.strictEqual(
      isDisabled,
      true,
      "El botón 'Agregar' se habilitó sin terapia seleccionada."
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
