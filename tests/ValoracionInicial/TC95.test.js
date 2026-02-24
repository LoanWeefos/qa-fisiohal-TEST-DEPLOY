const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC95 — Validar campo ¿Cómo ha sido su calidad de sueño en las últimas semanas?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC95 — Validar campo ¿Cómo ha sido su calidad de sueño en las últimas semanas? | 95 de 105\n");
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

    const suenoSelect = await global.helper.findOrFail(
      "//select[@name='C_mo_ha_sido_su_calidad_de_sue_o_en_las_ltimas_semanas']",
      "Campo Calidad de Sueño - No se encuentra en el formulario"
    );

    const optionEls = await suenoSelect.findElements(
      By.xpath(".//option")
    );

    const uiOptions = [];
    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Buena", "Regular", "Mala"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas\nUI: ${JSON.stringify(uiOptions)}`
    );

    await suenoSelect.sendKeys("Buena");
    await global.driver.sleep(300);

    let selectedValue = await suenoSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Buena"),
      "No se pudo seleccionar la opción 'Buena'"
    );

    const opcionMala = await suenoSelect.findElement(
      By.xpath(".//option[normalize-space()='Mala']")
    );

    await suenoSelect.click();
    await opcionMala.click();
    await global.driver.sleep(300);

    selectedValue = await suenoSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Mala"),
      "No se pudo seleccionar la opción 'Mala'"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});