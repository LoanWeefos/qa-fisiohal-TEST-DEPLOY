const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC63 — Validar campo ¿Algún familiar ha tenido problemas de huesos o articulaciones?", function () {
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
      logger.info("\nEjecutando TC63 — Validar campo ¿Algún familiar ha tenido problemas de huesos o articulaciones? | 63 de 105\n");
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

    const huesosSelect = await global.helper.findOrFail(
      "//select[@name='Alg_n_familiar_ha_tenido_problemas_de_huesos_o_articulaciones_como_artritis_oste']",
      "Campo ¿Antecedentes familiares de huesos o articulaciones? - No se encuentra en el formulario"
    );

    const optionEls = await huesosSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Antecedentes familiares de huesos o articulaciones?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await huesosSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await huesosSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await huesosSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await huesosSelect.click();
    await opcionNo.click();

    selectedValue = await huesosSelect.getAttribute("value");

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