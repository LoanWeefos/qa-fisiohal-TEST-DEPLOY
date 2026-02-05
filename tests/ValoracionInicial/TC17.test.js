const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC17 — Verificar que el campo Número de telefono familiar responsable solo acepte números", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC17 — Verificar que el campo Número de telefono familiar responsable solo acepte números | 17 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo permite números", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const telefonoFamInput = await global.helper.findOrFail(
      "//span[normalize-space()='Número de teléfono familiar responsable']" +
      "/ancestor::flowruntime-lwc-field//input",
      "Campo Teléfono familiar responsable - No se encuentra en el formulario"
    );

    await telefonoFamInput.clear();
    await global.driver.sleep(100);

    const numerosValidos = "5512345678";
    await telefonoFamInput.sendKeys(numerosValidos);
    await global.driver.sleep(200);

    let valueUI = (await telefonoFamInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      numerosValidos,
      `El campo no aceptó números válidos. Valor actual: "${valueUI}"`
    );

    await telefonoFamInput.clear();
    await global.driver.sleep(100);

    await telefonoFamInput.sendKeys("abc");
    await global.driver.sleep(200);

    valueUI = (await telefonoFamInput.getAttribute("value")).trim();

    assert.ok(
      !/[a-zA-Z]/.test(valueUI),
      `El campo permitió texto. Valor actual: "${valueUI}"`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
