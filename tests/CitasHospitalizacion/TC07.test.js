const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");


describe("TC07 — Sin Área: no debe permitir agregar terapia", function () {
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
      logger.info("\nEjecutando TC07 — Sin Área: no debe permitir agregar terapia | 7 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Sin seleccionar Área, la lista de terapias debe estar deshabilitada", async () => {
    const areaInputXpath =
      "//label[contains(.,'Área de Atención')]/following::input[1]";

    const areaInput = await global.helper.findOrFail(
      areaInputXpath,
      "Campo Área de Atención - Debe existir un campo de selección para el área de atención en el formulario de creación de citas de hospitalización"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      areaInput
    );
    await areaInput.click();
    await global.driver.sleep(300);

    await areaInput.sendKeys(Key.CONTROL, "a");
    await global.driver.sleep(100);
    await areaInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(300);

    const addBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Agregar']",
      "Botón Agregar - Debe existir un botón 'Agregar' para añadir terapias en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(addBtn);

    assert.strictEqual(isDisabled, true);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
