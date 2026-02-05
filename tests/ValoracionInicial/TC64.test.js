const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC64 — Validar campo ¿Qué tipo de problema?, ¿Qué familiar lo tuvo?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC64 — Validar campo ¿Qué tipo de problema?, ¿Qué familiar lo tuvo? | 64 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it(`Debe funcionar correctamente cuando se selecciona "Si"`, async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(3);

    const huesosSelect = await global.helper.findOrFail(
      "//select[@name='Alg_n_familiar_ha_tenido_problemas_de_huesos_o_articulaciones_como_artritis_oste']",
      "Campo ¿Antecedentes familiares de huesos o articulaciones?"
    );

    await huesosSelect.sendKeys("No");
    await global.driver.sleep(300);

    let detalleProblemaInput = await global.driver.findElements(
      By.xpath("//input[@name='Qu_tipo_de_problema_Qu_familiar_lo_tuvo']")
    );

    assert.strictEqual(
      detalleProblemaInput.length,
      0,
      "El campo '¿Qué tipo de problema?, ¿Qué familiar lo tuvo?' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await huesosSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await huesosSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    detalleProblemaInput = await global.driver.findElements(
      By.xpath("//input[@name='Qu_tipo_de_problema_Qu_familiar_lo_tuvo']")
    );

    assert.ok(
      detalleProblemaInput.length > 0 &&
      (await detalleProblemaInput[0].isDisplayed()),
      "El campo '¿Qué tipo de problema?, ¿Qué familiar lo tuvo?' debería mostrarse al seleccionar 'Si'"
    );

    const input = detalleProblemaInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Artritis reumatoide en madre";
    await input.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = await input.getAttribute("value");

    assert.strictEqual(
      valueUI,
      textoValido,
      "El campo no aceptó texto válido"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(150);

    await input.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = await input.getAttribute("value");

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(150);

    await input.sendKeys("@#%");
    await global.driver.sleep(200);

    valueUI = await input.getAttribute("value");

    assert.ok(
      !/[^a-zA-ZÀ-ÿ\s]/.test(valueUI),
      `El campo permitió símbolos. Valor actual: "${valueUI}"`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});