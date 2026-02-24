const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC45 — Validar campo ¿Tienes alguna enfermedad con la que naciste (congénita)?", function () {
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
      logger.info("\nEjecutando TC45 — Validar campo ¿Tienes alguna enfermedad con la que naciste (congénita)? | 45 de 105\n");
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

    await global.helper.clickNext(3);

    const congenitaSelect = await global.helper.findOrFail(
      "//select[@name='Tienes_alguna_enfermedad_con_la_que_naciste_cong_nita']",
      "Campo ¿Tienes alguna enfermedad con la que naciste (congénita)? - No se encuentra en el formulario"
    );

    const optionEls = await congenitaSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Tienes alguna enfermedad con la que naciste (congénita)?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await congenitaSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await congenitaSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await congenitaSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await congenitaSelect.click();
    await opcionNo.click();

    selectedValue = await congenitaSelect.getAttribute("value");

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