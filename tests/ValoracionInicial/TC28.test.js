const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC28 — Validar campo Indique la música ambiental", function () {
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
      logger.info("\nEjecutando TC28 — Validar campo Indique la música ambiental | 28 de 105\n");
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

    const musicaInput = await global.helper.findOrFail(
      "//input[@name='Indique_la_m_sica_ambiental']",
      "Campo Indique la música ambiental - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].focus(); arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      musicaInput
    );
    await global.driver.sleep(150);

    const textoValido = "Sonidos de la naturaleza";
    await musicaInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await musicaInput.getAttribute("value")).trim();
    assert.strictEqual(valueUI, textoValido, "No aceptó texto válido");

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      musicaInput
    );
    await global.driver.sleep(150);

    await musicaInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await musicaInput.getAttribute("value")).trim();
    assert.ok(!/[0-9]/.test(valueUI), `El campo permitió números: "${valueUI}"`);

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      musicaInput
    );
    await global.driver.sleep(150);

    await musicaInput.sendKeys("@#");
    await global.driver.sleep(200);

    valueUI = (await musicaInput.getAttribute("value")).trim();
    assert.ok(!/[^a-zA-ZÀ-ÿ\s]/.test(valueUI), `El campo permitió símbolos: "${valueUI}"`);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});