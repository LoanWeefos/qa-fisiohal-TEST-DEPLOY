const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC15 — Validar cuenta seleccionada", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC15 — Validar cuenta seleccionada | 15 de 50\n");
    }
    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar error y no permitir avanzar sin Parent Record", async () => {
    const clearBtn =
      "//button[@title='Clear Parent Record Selection' and not(@disabled)]";

    await global.helper.safeFindAndClick(clearBtn, "Boton Clear Selection - Debe existir el botón 'Clear Parent Record Selection' en la página de cuenta");
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(800);

    const errorXpath =
      "//ul[contains(@class,'uiInputDefaultError')]" +
      "//li[normalize-space()='Complete this field.']";

    const errorExists = await global.helper.findOrFail(
      errorXpath,
      "Mensaje de error 'Complete this field.' - Debe existir el mensaje de error 'Complete this field.' en la página de agenda cita"
    );

    assert.ok(errorExists, "No se mostró el mensaje 'Complete this field.'");

    const stillOnStep = await global.helper.findOrFail(
      "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(.,'Select Attendees')]",
      "Título de etapa Select Attendees - Debe existir el título de etapa 'Select Attendees' en la página de agenda cita"
    );

    assert.ok(stillOnStep, "El Flow avanzó de etapa cuando no debía");
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
