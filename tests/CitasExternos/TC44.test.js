const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC44 — Validar Días por agendar obligatorio", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC44 — Validar Días por agendar obligatorio | 44 de 50\n");
    }


    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar error si no se seleccionan días", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.helper.safeFindAndClick(
      "//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico - Debe existir una opción de terapia llamada 'E Drenaje Linfatico' en la página de agenda cita"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']",
      "Opción Cubiculo B - Debe existir el área 'Cubiculo B' en las opciones de áreas del step Select Service Territory"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas");

    const row = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila Cecilia Ramirez - Debe existir una fila con el nombre 'Cecilia Ramirez' en la tabla de terapeutas"
    );

    const radio = await row.findElement(By.xpath(".//input[@type='radio']"));
    await global.driver.executeScript("arguments[0].click()", radio);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today"
    );

    const slots = await global.driver.findElements(
      By.xpath("//span[contains(@class,'slds-radio_faux')]")
    );
    await global.driver.executeScript("arguments[0].click()", slots.at(-1));

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );

    const toggle = await global.helper.findOrFail(
      "//span[normalize-space()='¿Deseas activar recurrencia?']/ancestor::label//input[@type='checkbox']",
      "Toggle recurrencia - Debe existir un toggle para activar la recurrencia de la cita"
    );
    await global.driver.executeScript("arguments[0].click()", toggle);

    const input = await global.helper.findOrFail(
      "//input[@name='Cantidad_de_Citas']", "Input Cantidad de Citas - Debe existir un campo de texto para ingresar la cantidad de citas a generar al activar la recurrencia"
    );

    await input.clear();
    await input.sendKeys("5");

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );

    const diasError = await global.helper.findOrFail(
      "//span[normalize-space()='Días por agendar']" +
        "/ancestor::fieldset" +
        "//div[contains(@class,'flowruntime-input-error')]",
      "Error Días por agendar - Debe mostrarse un mensaje de error indicando que los 'Días por agendar' es obligatorio al intentar avanzar sin seleccionar ningún día"
    );

    const text = await diasError.getText();
    assert.ok(text.includes("Please select a choice"));
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
