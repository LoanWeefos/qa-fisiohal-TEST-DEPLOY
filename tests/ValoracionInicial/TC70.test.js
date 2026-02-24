const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC70 — Validar campo Especificar Auxiliares de marcha", function () {
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
      logger.info("\nEjecutando TC70 — Validar campo Especificar Auxiliares de marcha | 70 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it(`Debe funcionar correctamente cuando se selecciona "Si" / Comprobar elementos en el campo y solo elegir 1 elemento`, async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(4);

    const auxiliaresSelect = await global.helper.findOrFail(
      "//select[@name='Auxiliares_de_marcha']",
      "Campo Auxiliares de marcha - No se encuentra en el formulario"
    );

    await auxiliaresSelect.sendKeys("No");
    await global.driver.sleep(300);

    let especificarSelect = await global.driver.findElements(
      By.xpath("//select[@name='Especificar_Auxiliares_de_marcha']")
    );

    assert.strictEqual(
      especificarSelect.length,
      0,
      "El campo 'Especificar Auxiliares de marcha' NO debería mostrarse cuando se selecciona 'No'"
    );

    const opcionSi = await auxiliaresSelect.findElement(
      By.xpath(".//option[@value='Si']")
    );

    await auxiliaresSelect.click();
    await opcionSi.click();
    await global.driver.sleep(500);

    especificarSelect = await global.driver.findElements(
      By.xpath("//select[@name='Especificar_Auxiliares_de_marcha']")
    );

    assert.ok(
      especificarSelect.length > 0 &&
      (await especificarSelect[0].isDisplayed()),
      "El campo 'Especificar Auxiliares de marcha' debería mostrarse al seleccionar 'Si'"
    );

    const select = especificarSelect[0];

    const optionEls = await select.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = [
      "Bastón",
      "Muletas",
      "Andadera",
      "Silla de ruedas",
      "Prótesis",
      "Órtesis",
    ];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en Especificar Auxiliares de marcha\nUI: ${JSON.stringify(uiOptions)}`
    );

    await select.sendKeys("Bastón");
    await global.driver.sleep(300);

    const selectedValue = await select.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Baston",
      "No se pudo seleccionar la opción 'Bastón'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});