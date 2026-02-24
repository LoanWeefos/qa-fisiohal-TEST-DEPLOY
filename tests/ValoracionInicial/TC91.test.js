const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC91 — Validar campo ¿Esta condición a afectado su calidad de vida?", function () {
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
      logger.info("\nEjecutando TC91 — Validar campo ¿Esta condición a afectado su calidad de vida? | 91 de 105\n");
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

    await global.helper.clickNext(5);

    const calidadSelect = await global.helper.findOrFail(
      "//select[@name='Esta_condici_n_a_afectado_su_calidad_de_vida']",
      "Campo calidad de vida - No se encuentra en el formulario"
    );

    const optionEls = await calidadSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en Calidad de Vida\nUI: ${JSON.stringify(uiOptions)}`
    );

    await calidadSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await calidadSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "calidaddevida.Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await calidadSelect.findElement(
      By.xpath(".//option[@value='calidaddevida.No']")
    );

    await calidadSelect.click();
    await opcionNo.click();

    selectedValue = await calidadSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "calidaddevida.No",
      "No se pudo seleccionar la opción 'No'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});