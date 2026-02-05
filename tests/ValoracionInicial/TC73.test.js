const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC73 — Validar campo ¿Siente que la edad ha afectado su fuerza, equilibrio o capacidad para moverse con seguridad?", function () {
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
      logger.info("\nEjecutando TC73 — Validar campo ¿Siente que la edad ha afectado su fuerza, equilibrio o capacidad para moverse con seguridad? | 73 de 105\n");
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

    await global.helper.clickNext(4);

    const edadSelect = await global.helper.findOrFail(
      "//select[@name='Siente_que_la_edad_ha_afectado_su_fuerza_equilibrio_o_capacidad_para_moverse_con']",
      "Campo impacto de la edad"
    );

    const optionEls = await edadSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en impacto de la edad\nUI: ${JSON.stringify(uiOptions)}`
    );

    await edadSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await edadSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await edadSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await edadSelect.click();
    await opcionNo.click();

    selectedValue = await edadSelect.getAttribute("value");

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