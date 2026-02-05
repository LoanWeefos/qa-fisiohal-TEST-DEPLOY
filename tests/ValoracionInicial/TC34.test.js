const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC34 — Validar campo Alergias", function () {
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
      logger.info("\nEjecutando TC34 — Validar campo Alergias | 34 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(2);

    const alergiasSelect = await global.helper.findOrFail(
      "//select[@name='Alergias']",
      "Campo Alergias"
    );

    const optionEls = await alergiasSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Negadas", "Si, Especificar"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en Alergias.\nUI: ${JSON.stringify(uiOptions)}`
    );

    await alergiasSelect.sendKeys("Negadas");
    await global.driver.sleep(300);

    let selectedValue = await alergiasSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Negadas"),
      "No se pudo seleccionar la opción 'Negadas'"
    );

    const opcionSiEspecificar = await alergiasSelect.findElement(
      By.xpath(".//option[@value='SiEspecificar']")
    );

    await alergiasSelect.click();
    await opcionSiEspecificar.click();
    await global.driver.sleep(300);

    selectedValue = await alergiasSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "SiEspecificar",
      "No se pudo seleccionar la opción 'Si, Especificar'"
    );

  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});