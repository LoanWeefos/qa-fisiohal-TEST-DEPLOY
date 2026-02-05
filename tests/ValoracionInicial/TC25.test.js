const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC25 — Validar campo Indique por favor si quiere un Género, Artista y/o música ambiental", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  const expectedOptions = [
    "Género",
    "Artista",
    "Música ambiental",
  ];

  const triggerValues = ["Si", "A veces"];

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC25 — Validar campo Indique por favor si quiere un Género, Artista y/o música ambiental | 25 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();

    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);
  });

  for (const value of triggerValues) {
    it(`Debe funcionar correctamente cuando se selecciona "${value}"`, async () => {
      const escucharMusicaSelect = await global.driver.findElement(
        By.xpath("//select[@name='Durante_su_terapia_Le_gustar_a_escuchar_m_sica']")
      );

      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        escucharMusicaSelect
      );

      await escucharMusicaSelect.sendKeys(value);
      await global.driver.sleep(800);

      const generoSelect = await global.helper.findOrFail(
        "//label[normalize-space()='Indique Música sonido ambiental o género']/following::select[1]",
        `Campo Indique por favor si quiere un Género, Artista y/o música ambiental - No se encuentra en el formulario`
      );

      assert.ok(
        await generoSelect.isDisplayed(),
        `El campo dependiente no es visible con ${value}`
      );

      const options = await generoSelect.findElements(By.tagName("option"));

      const optionTexts = [];
      for (const opt of options) {
        const text = (await opt.getText()).trim();
        if (text && text !== "--None--") {
          optionTexts.push(text);
        }
      }

      assert.deepStrictEqual(
        optionTexts.sort(),
        expectedOptions.sort(),
        `Opciones incorrectas con ${value}. UI: ${JSON.stringify(optionTexts)}`
      );

      await generoSelect.sendKeys("Género");
      await global.driver.sleep(500);

      const selected = await generoSelect.findElements(
        By.xpath(".//option[@selected]")
      );

      assert.strictEqual(
        selected.length,
        1,
        `El campo permite más de una selección con ${value}`
      );
    });
  }

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});