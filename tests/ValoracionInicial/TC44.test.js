const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC44 — Validar campo Tipo de cirugía y fecha", function () {
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
      logger.info("\nEjecutando TC44 — Validar campo Tipo de cirugía y fecha | 44 de 105\n");
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
    
    const cirugiaSelect = await global.helper.findOrFail(
      "//select[@name='Alguna_vez_te_han_hecho_una_cirug_a']",
      "Campo ¿Alguna vez te han hecho una cirugía? - No se encuentra en el formulario"
    );

    await cirugiaSelect.sendKeys("No");
    await global.driver.sleep(300);

    let tipoCirugiaInput = await global.driver.findElements(
      By.xpath("//input[@name='Tipo_de_cirug_a_y_fecha']")
    );

    assert.strictEqual(
      tipoCirugiaInput.length,
      0,
      "El campo 'Tipo de cirugía y fecha' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await cirugiaSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await cirugiaSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    tipoCirugiaInput = await global.driver.findElements(
      By.xpath("//input[@name='Tipo_de_cirug_a_y_fecha']")
    );

    assert.ok(
      tipoCirugiaInput.length > 0 && await tipoCirugiaInput[0].isDisplayed(),
      "El campo 'Tipo de cirugía y fecha' debería mostrarse al seleccionar 'Si'"
    );

    const input = tipoCirugiaInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );
    await global.driver.sleep(200);

    const textoValido = "Apendicectomía enero 2022";
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