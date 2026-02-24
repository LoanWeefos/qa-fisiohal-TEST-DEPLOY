const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC76 — Validar campo ¿Recientemente le han realizado estudios o procedimientos cardíacos que hayan afectado su presión arterial o le hayan provocado mareos?", function () {
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
      logger.info("\nEjecutando TC76 — Validar campo ¿Recientemente le han realizado estudios o procedimientos cardíacos que hayan afectado su presión arterial o le hayan provocado mareos? | 76 de 105\n");
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

    await global.helper.clickNext(4);

    const procedimientosSelect = await global.helper.findOrFail(
      "//select[@name='Recientemente_le_han_realizado_estudios_o_procedimientos_card_acos_que_hayan_afe']",
      "Campo procedimientos cardíacos recientes - No se encuentra en el formulario"
    );

    const optionEls = await procedimientosSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en procedimientos cardíacos recientes\nUI: ${JSON.stringify(uiOptions)}`
    );

    await procedimientosSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await procedimientosSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await procedimientosSelect.findElement(
      By.xpath(".//option[@value='No']")
    );
    await procedimientosSelect.click();
    await opcionNo.click();

    selectedValue = await procedimientosSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "No",
      "No se pudo seleccionar la opción 'No'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});