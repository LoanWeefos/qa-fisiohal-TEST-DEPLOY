const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC48 — Validar campo ¿Cuál fue la enfermadad importante cuando eras niño o niña?", function () {
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
      logger.info("\nEjecutando TC48 — Validar campo ¿Cuál fue la enfermadad importante cuando eras niño o niña? | 48 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it(`Debe funcionar correctamente cuando se selecciona "Si"`, async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(3);

    const enfermedadInfanciaSelect = await global.helper.findOrFail(
      "//select[@name='Tuviste_alguna_enfermedad_importante_cuando_eras_ni_o_o_ni_a']",
      "Campo ¿Tuviste alguna enfermedad importante cuando eras niño o niña? - No se encuentra en el formulario"
    );

    await enfermedadInfanciaSelect.sendKeys("No");
    await global.driver.sleep(300);

    let enfermedadInput = await global.driver.findElements(
      By.xpath("//input[@name='Enfermedad_importante_en_la_infancia']")
    );

    assert.strictEqual(
      enfermedadInput.length,
      0,
      "El campo '¿Cuál fue la enfermedad importante cuando eras niño o niña?' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await enfermedadInfanciaSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await enfermedadInfanciaSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    enfermedadInput = await global.driver.findElements(
      By.xpath("//input[@name='Enfermedad_importante_en_la_infancia']")
    );

    assert.ok(
      enfermedadInput.length > 0 && await enfermedadInput[0].isDisplayed(),
      "El campo '¿Cuál fue la enfermedad importante cuando eras niño o niña?' debería mostrarse al seleccionar 'Si'"
    );

    const input = enfermedadInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Asma en la infancia";
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