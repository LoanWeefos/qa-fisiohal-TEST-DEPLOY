const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC100 — Validar campo ¿Su lesión ha afectado la práctica de este deporte o actividad?", function () {
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
      logger.info("\nEjecutando TC100 — Validar campo ¿Su lesión ha afectado la práctica de este deporte o actividad? | 100 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Debe mostrar las opciones correctas y permitir seleccionar solo un elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(6);

    const practicaSelect = await global.helper.findOrFail(
      "//select[@name='Practica_alg_n_deporte_hobbie_o_realiza_alguna_actividad_recreativa_frecuente']",
      "Campo Práctica actividad recreativa - No se encuentra en el formulario"
    );

    await practicaSelect.sendKeys("Si");
    await global.driver.sleep(500);

    const lesionSelect = await global.helper.findOrFail(
      "//select[@name='Su_lesi_n_ha_afectado_la_pr_ctica_de_este_deporte_o_actividad']",
      "Campo ¿Su lesión ha afectado la práctica? - No se encuentra en el formulario"
    );

    const optionEls = await lesionSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = [
      "Si, ahora es más difícil practicarlo",
      "Si, he dejado de practicarlo temporalmente",
      "No, sigo practicándolo sin problema",
    ];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en el campo ¿Su lesión ha afectado la práctica?\nUI: ${JSON.stringify(uiOptions)}`
    );

    await lesionSelect.sendKeys("No, sigo practicándolo sin problema");
    await global.driver.sleep(300);

    const selectedValue = await lesionSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Nosigopracticandolosinproblema",
      "No se pudo seleccionar correctamente la opción"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});