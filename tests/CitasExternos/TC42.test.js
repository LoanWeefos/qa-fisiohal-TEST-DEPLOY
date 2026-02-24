const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC42 — Validar Cantidad de Citas vacía", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC42 — Validar Cantidad de Citas vacía | 42 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar error por Cantidad de Citas obligatoria", async () => {
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
      "Boton Today - Debe existir el botón 'Today' para seleccionar la fecha actual en el calendario de selección de horario"
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
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );

    const cantidadError = await global.helper.findOrFail(
      "//span[normalize-space()='Cantidad de Citas']" +
        "/ancestor::flowruntime-screen-field" +
        "//div[contains(@class,'flowruntime-input-error')]",
      "Error Cantidad de Citas - Debe mostrarse un mensaje de error indicando que la 'Cantidad de Citas' es obligatoria al intentar avanzar sin ingresar un valor"
    );

    const text = await cantidadError.getText();
    assert.ok(text.includes("Please enter some valid input"));
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
