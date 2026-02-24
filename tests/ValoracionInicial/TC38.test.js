const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC38 — Validar campo ¿Usted usa Marcapasos?", function () {
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
      logger.info("\nEjecutando TC38 — Validar campo ¿Usted usa Marcapasos? | 38 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(2);

    const marcapasosSelect = await global.helper.findOrFail(
      "//select[@name='Usted_usa_Marcapasos']",
      "Campo ¿Usted usa Marcapasos? - No se encuentra en el formulario"
    );

    const optionEls = await marcapasosSelect.findElements(
      By.xpath(".//option")
    );

    const uiOptions = [];
    for (const opt of optionEls) {
      let text = (await opt.getText()).trim();
      if (text && text !== "--None--") {
        text = text.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
        uiOptions.push(text);
      }
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Usted usa Marcapasos?.
        UI: ${JSON.stringify(uiOptions)}`
    );

    await marcapasosSelect.sendKeys("Si ⚠️ ❤️");
    await global.driver.sleep(300);

    let selectedValue = await marcapasosSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si_Marcapasos",
      "No se pudo seleccionar la opción 'Sí'"
    );

    const opcionNo = await marcapasosSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await marcapasosSelect.click();
    await opcionNo.click();

    selectedValue = await marcapasosSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "No",
      "El campo no permite cambiar la selección correctamente"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});