const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC37 — Validar campo Condiciones médicas previas", function () {
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
      logger.info("\nEjecutando TC37 — Validar campo Condiciones médicas previas | 37 de 105\n");
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

    const condicionesSelect = await global.helper.findOrFail(
      "//select[@name='Condiciones_m_dicas_previas']",
      "Campo Condiciones médicas previas"
    );

    const optionElements = await condicionesSelect.findElements(
      By.xpath(".//option")
    );

    const uiOptions = [];
    for (const opt of optionElements) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") {
        uiOptions.push(text);
      }
    }

    const expectedOptions = [
      "Diabetes",
      "Hipertensión",
      "Enfermedades Cardiacas",
      "Cirugias Previas",
      "Otras",
    ];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en Condiciones médicas previas. UI: ${JSON.stringify(uiOptions)}`
    );

    await condicionesSelect.sendKeys("Diabetes");
    await global.driver.sleep(300);

    let selectedValue = await condicionesSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Diabetes",
      "No se pudo seleccionar la opción 'Diabetes'"
    );

    await condicionesSelect.sendKeys("Otras");
    await global.driver.sleep(300);

    const opcionOtras = await condicionesSelect.findElement(
      By.xpath(".//option[@value='Otras']")
    );

    await condicionesSelect.click();
    await opcionOtras.click();

    selectedValue = await condicionesSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Otras",
      "El campo no permite cambiar la selección correctamente"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});