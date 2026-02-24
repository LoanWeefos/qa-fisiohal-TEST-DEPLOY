const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC97 — Validar campo ¿Practica algún deporte, hobbie o realiza alguna actividad recreativa frecuente?", function () {
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
      logger.info("\nEjecutando TC97 — Validar campo ¿Practica algún deporte, hobbie o realiza alguna actividad recreativa frecuente? | 97 de 105\n");
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

    await global.helper.clickNext(6);

    const actividadSelect = await global.helper.findOrFail(
      "//select[@name='Practica_alg_n_deporte_hobbie_o_realiza_alguna_actividad_recreativa_frecuente']",
      "Campo Actividad Recreativa Frecuente - No se encuentra en el formulario"
    );

    const optionEls = await actividadSelect.findElements(
      By.xpath(".//option")
    );
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas\nUI: ${JSON.stringify(uiOptions)}`
    );

    await actividadSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await actividadSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Si"),
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await actividadSelect.findElement(
      By.xpath(".//option[normalize-space()='No']")
    );

    await actividadSelect.click();
    await opcionNo.click();
    await global.driver.sleep(300);

    selectedValue = await actividadSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("No"),
      "No se pudo seleccionar la opción 'No'"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});