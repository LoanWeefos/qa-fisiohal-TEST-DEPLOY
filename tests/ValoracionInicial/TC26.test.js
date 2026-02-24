const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC26 — Validar campo Indique el género", function () {
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
      logger.info("\nEjecutando TC26 — Validar campo Indique el género | 26 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo debe aceptar texto, inidicar con un mensaje de advertencia", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const escucharMusicaSelect = await global.driver.findElement(
      By.xpath("//select[@name='Durante_su_terapia_Le_gustar_a_escuchar_m_sica']")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      escucharMusicaSelect
    );

    await escucharMusicaSelect.sendKeys('Si');
    await global.driver.sleep(800);

    const generoInput = await global.helper.findOrFail(
      "//span[normalize-space()='Indique el género']" +
      "/ancestor::flowruntime-lwc-field//input",
      "Campo Indique el género - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].focus();" +
      "arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      generoInput
    );
    await global.driver.sleep(150);

    const textoValido = "Rock alternativo";
    await generoInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await generoInput.getAttribute("value")).trim();

    assert.strictEqual(
      valueUI,
      textoValido,
      `El campo no aceptó texto válido. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      generoInput
    );
    await global.driver.sleep(150);

    await generoInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await generoInput.getAttribute("value")).trim();

    assert.ok(
      !/[0-9]/.test(valueUI),
      `El campo permitió números. Valor actual: "${valueUI}"`
    );

    await global.driver.executeScript(
      "arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      generoInput
    );
    await global.driver.sleep(150);

    await generoInput.sendKeys("@#");
    await global.driver.sleep(200);

    valueUI = (await generoInput.getAttribute("value")).trim();

    assert.ok(
      !/[^a-zA-ZÀ-ÿ\s]/.test(valueUI),
      `El campo permitió símbolos. Valor actual: "${valueUI}"`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});