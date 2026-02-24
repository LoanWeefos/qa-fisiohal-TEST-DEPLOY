const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");


describe("TC02 — Formulario: campos clave visibles", function () {
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
      logger.info("\nEjecutando TC02 — Formulario: campos clave visibles | 2 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Debe mostrarse Frecuencia, Fecha y Área de Atención", async () => {
    const frequency = await global.helper.findOrFail(
      "//label[normalize-space()='Frecuencia de Terapia']",
      "Frecuencia de Terapia - Debe existir el campo 'Frecuencia de Terapia' en el formulario de creación de citas de hospitalización"
    );

    const date = await global.helper.findOrFail(
      "//label[normalize-space()='Fecha']",
      "Fecha - Debe existir el campo 'Fecha' en el formulario de creación de citas de hospitalización"
    );

    const area = await global.helper.findOrFail(
      "//label[normalize-space()='Área de Atención']",
      "Área de Atención - Debe existir el campo 'Área de Atención' en el formulario de creación de citas de hospitalización"
    );

    assert.ok(frequency, "No se encontró el campo 'Frecuencia de Terapia'.");
    assert.ok(date, "No se encontró el campo 'Fecha'.");
    assert.ok(area, "No se encontró el campo 'Área de Atención'.");
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
