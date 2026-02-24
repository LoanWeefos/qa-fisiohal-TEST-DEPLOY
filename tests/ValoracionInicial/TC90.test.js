const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC90 — Validar campo Especificar limite en sus actividades cotidianas", function () {
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
      logger.info("\nEjecutando TC90 — Validar campo Especificar limite en sus actividades cotidianas | 90 de 105\n");
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

    await global.helper.clickNext(5);

    const limitaSelect = await global.helper.findOrFail(
      "//select[@name='Limita_sus_actividades_cotidianas']",
      "Campo ¿Limita sus actividades cotidianas? - No se encuentra en el formulario"
    );

    await limitaSelect.sendKeys("No");
    await global.driver.sleep(500);

    let especificarInput = await global.driver.findElements(
      By.xpath("//input[@name='Especificar_limite_en_sus_actividades_co']")
    );

    assert.strictEqual(
      especificarInput.length,
      0,
      "El campo NO debería mostrarse cuando se selecciona 'No'"
    );

    await limitaSelect.sendKeys("Si");
    await global.driver.sleep(500);

    especificarInput = await global.driver.findElements(
      By.xpath("//input[@name='Especificar_limite_en_sus_actividades_co']")
    );

    assert.ok(
      especificarInput.length > 0 && await especificarInput[0].isDisplayed(),
      "El campo debería mostrarse cuando se selecciona 'Si'"
    );

    const input = especificarInput[0];

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );

    const textoValido = "Dificultad para caminar largas distancias";
    await input.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await input.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      "El campo no aceptó texto válido"
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );

    await input.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await input.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles:true }));",
      input
    );

    await input.sendKeys("@#%");
    await global.driver.sleep(200);

    valueUI = (await input.getAttribute("value")).trim();

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