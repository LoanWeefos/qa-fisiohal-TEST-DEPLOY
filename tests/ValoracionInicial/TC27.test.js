const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC27 — Validar campo Indique al artista", function () {
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
      logger.info("\nEjecutando TC27 — Validar campo Indique al artista | 27 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("El campo solo debe aceptar texto, inidicar con un mensaje de advertencia", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
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

    const artistaInput = await global.helper.findOrFail(
      "//input[@name='Indique_al_artista']",
      "Campo Indique al artista"
    );

    await global.driver.executeScript(
      "arguments[0].focus(); arguments[0].value='';" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      artistaInput
    );
    await global.driver.sleep(150);

    const textoValido = "Franz Ferdinand";
    await artistaInput.sendKeys(textoValido);
    await global.driver.sleep(200);

    let valueUI = (await artistaInput.getAttribute("value")).trim();
    assert.strictEqual(valueUI, textoValido, "No aceptó texto válido");

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      artistaInput
    );
    await global.driver.sleep(150);

    await artistaInput.sendKeys("123");
    await global.driver.sleep(200);

    valueUI = (await artistaInput.getAttribute("value")).trim();
    assert.ok(!/[0-9]/.test(valueUI), `El campo permitió números: "${valueUI}"`);

    await global.driver.executeScript(
      "arguments[0].value=''; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      artistaInput
    );
    await global.driver.sleep(150);

    await artistaInput.sendKeys("@#");
    await global.driver.sleep(200);

    valueUI = (await artistaInput.getAttribute("value")).trim();
    assert.ok(!/[^a-zA-ZÀ-ÿ\s]/.test(valueUI), `El campo permitió símbolos: "${valueUI}"`);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});