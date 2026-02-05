const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC21 — Validar campo Idioma de preferencia", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  const expectedOptions = [
    "Español",
    "Ingles",
    "Hebreo",
    "Alemán",
    "Frances",
    "Árabe",
    "Chino",
    "Japonés",
    "Ruso",
  ];

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "sony_2105@yahoo.com.mx.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC21 — Validar campo Idioma de preferencia | 21 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos de la lista y solo puede elegir 1 elemento de la lista", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const idiomaSelect = await global.helper.findOrFail(
      "//span[normalize-space()='Idioma de preferencia']" +
      "/ancestor::flowruntime-lwc-field//select",
      "Campo Idioma de preferencia"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({ block: 'center' });",
      idiomaSelect
    );
    await global.driver.sleep(300);

    const optionElements = await idiomaSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionElements) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") {
        uiOptions.push(text);
      }
    }

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Las opciones del campo Idioma no son correctas.\nUI: ${uiOptions.join(
        ", "
      )}`
    );

    const idiomaSeleccionado = "Ingles";
    await idiomaSelect.sendKeys(idiomaSeleccionado);
    await global.driver.sleep(300);

    const selectedValue =
      (await idiomaSelect.getAttribute("value")) || "";

    assert.ok(
      selectedValue.includes("Ingles"),
      `No se seleccionó correctamente el idioma. Value actual: ${selectedValue}`
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});