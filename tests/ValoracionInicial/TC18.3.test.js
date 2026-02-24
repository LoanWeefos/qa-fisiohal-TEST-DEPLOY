const assert = require("assert");
const { By } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC18.3 — Preferencias visibles | Coordinación", function () {
  this.timeout(0);

  const expected = { AccountName: "TEST TEST" };
  const LOGIN = "ehaiden@fisiohal.com.partial";

  beforeEach(async function () {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent",
        LOGIN
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC18.3 — Preferencias visibles | Coordinación\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Los campos deben ser visibles", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);
    await global.helper.clickNext(1);

    const hablarUsted = await global.driver.findElements(
      By.xpath("//span[contains(normalize-space(),'hablen de usted')]/ancestor::flowruntime-lwc-field")
    );
    assert.ok(hablarUsted.length > 0 && await hablarUsted[0].isDisplayed(),
      "Debe mostrarse el campo '¿Le gusta que le hablen de usted?'"
    );

    const comoLlamar = await global.driver.findElements(
      By.xpath("//span[contains(normalize-space(),'te llamen')]/ancestor::flowruntime-lwc-field")
    );
    assert.ok(comoLlamar.length > 0 && await comoLlamar[0].isDisplayed(),
      "Debe mostrarse el campo '¿Cómo te gusta que lo / te llamen?'"
    );

    const idioma = await global.driver.findElements(
      By.xpath("//span[contains(normalize-space(),'Idioma de preferencia')]/ancestor::flowruntime-lwc-field")
    );
    assert.ok(idioma.length > 0 && await idioma[0].isDisplayed(),
      "Debe mostrarse el campo 'Idioma de preferencia'"
    );

    const luz = await global.driver.findElements(
      By.xpath("//span[contains(normalize-space(),'intensidad de la luz')]/ancestor::flowruntime-lwc-field//button")
    );
    assert.ok(luz.length > 0 && await luz[0].isDisplayed(),
      "Debe mostrarse el campo 'Elija la intensidad de la luz preferente'"
    );

    const conversar = await global.driver.findElements(
      By.xpath("//span[contains(normalize-space(),'gustaría conversar')]/ancestor::flowruntime-lwc-field")
    );
    assert.ok(conversar.length > 0 && await conversar[0].isDisplayed(),
      "Debe mostrarse el campo '¿Le gustaría conversar?'"
    );

    const musica = await global.driver.findElements(
      By.xpath("//span[contains(normalize-space(),'escuchar música')]/ancestor::flowruntime-lwc-field")
    );
    assert.ok(musica.length > 0 && await musica[0].isDisplayed(),
      "Debe mostrarse el campo '¿Le gustaría escuchar música?'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});
