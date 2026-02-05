const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC35 — Validar visibilidad de campo Especificar alergias", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC35 — Validar visibilidad de campo Especificar alergias | 35 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Este campo solo se muestra si en el campo: Alergias, se selecciona: Si, especificar", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(2);

    const alergiasSelect = await global.helper.findOrFail(
      "//select[@name='Alergias']",
      "Campo Alergias"
    );

    await alergiasSelect.sendKeys("Negadas");
    await global.driver.sleep(300);

    let campoEspecificar = await global.driver.findElements(
      By.xpath("//input[@name='Especificar_alergias']")
    );

    assert.strictEqual(
      campoEspecificar.length,
      0,
      "El campo 'Especificar alergias' NO debería mostrarse cuando se selecciona 'Negadas'"
    );

    const opcionSiEspecificar = await alergiasSelect.findElement(
      By.xpath(".//option[@value='SiEspecificar']")
    );

    await alergiasSelect.click();
    await opcionSiEspecificar.click();
    await global.driver.sleep(300);

    campoEspecificar = await global.driver.findElements(
      By.xpath("//input[@name='Especificar_alergias']")
    );

    assert.ok(
      campoEspecificar.length > 0 && await campoEspecificar[0].isDisplayed(),
      "El campo 'Especificar alergias' debería mostrarse al seleccionar 'Si, Especificar'"
    );

    const especificarInput = campoEspecificar[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      especificarInput
    );

    await especificarInput.sendKeys("Polen");
    await global.driver.sleep(200);

    const valueUI = await especificarInput.getAttribute("value");

    assert.strictEqual(
      valueUI,
      "Polen",
      "No se pudo escribir en el campo 'Especificar alergias'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});