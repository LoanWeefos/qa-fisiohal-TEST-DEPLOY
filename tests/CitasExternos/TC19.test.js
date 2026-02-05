const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC19 — Validar terapia seleccionada", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC19 — Validar terapia seleccionada | 19 de 50\n");
    }
    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe mostrar error si no se selecciona terapia", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1000);
    const errorElement = await global.helper.findOrFail(
      "//a[contains(@class,'errorsListLink') and normalize-space()='Select a work type group.']",
      "Mensaje de error Select a work type group."
    );

    const errorText = await errorElement.getText();

    assert.strictEqual(
      errorText,
      "Select a work type group.",
      "No se mostró el mensaje de error correcto."
    );

    const activeStep = await (
      await global.helper.findOrFail(
        "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(@class,'slds-assistive-text')]",
        "Título de etapa activa"
      )
    ).getText();

    assert.strictEqual(
      activeStep.toLowerCase().includes("topic"),
      true,
      "Avanzó de step aunque no se seleccionó work type group."
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
