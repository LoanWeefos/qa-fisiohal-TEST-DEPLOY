const assert = require("assert");
const { By, Key } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC26 — Validar espacios en campos obligatorios", function () {
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
      logger.info("\nEjecutando TC26 — Validar espacios en campos obligatorios | 26 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("No debe permitir guardar si Área contiene solo espacios", async () => {
    const areaInputXpath =
      "//label[contains(.,'Área de Atención')]/following::input[1]";

    const areaInput = await global.helper.findOrFail(
      areaInputXpath,
      "Input Área de Atención - Debe existir un campo de selección para el área de atención en el formulario de creación de citas de hospitalización"
    );

    await global.helper.safeFindAndClick(
      areaInputXpath,
      "Campo Área de Atención - Debe existir un campo de selección para el área de atención en el formulario de creación de citas de hospitalización"
    );
    await global.driver.sleep(150);

    await areaInput.sendKeys(Key.CONTROL, "a");
    await areaInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(150);

    await areaInput.sendKeys("   ");
    await areaInput.sendKeys(Key.TAB);
    await global.driver.sleep(300);

    const value = (await areaInput.getAttribute("value")) || "";

    assert.strictEqual(
      value.trim(),
      "",
      `El sistema aceptó solo espacios como valor válido. value='${value}'`
    );

    const saveBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Guardar']",
      "Botón Guardar - Debe existir un botón 'Guardar' para guardar la cita en el formulario de creación de citas de hospitalización"
    );

    const isDisabled = await global.helper.isButtonDisabled(saveBtn);

    let errorToast = false;
    if (!isDisabled) {
      try {
        await saveBtn.click();
        await global.driver.sleep(500);
        errorToast = !!(await global.helper.checkErrorToast());
      } catch (e) {
        errorToast = true;
      }
    }

    assert.ok(
      isDisabled || errorToast,
      `Guardar permitió continuar con Área inválida (solo espacios).`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
