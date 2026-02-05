const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC22 — Validar área seleccionada", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC22 — Validar área seleccionada | 22 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']"
    );
  });

  it("Debe mostrar error si no se selecciona área", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );

    const currentStep = await (
      await global.helper.findOrFail(
        "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(@class,'slds-assistive-text')]",
        "Título de etapa activa"
      )
    ).getText();

    assert.strictEqual(
      currentStep.includes("Select Topic"),
      true,
      "No se encuentra en el step 'Select Topic'."
    );

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico"
    );
    await global.driver.sleep(600);
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);
    const errorElement = await global.helper.findOrFail(
      "//a[contains(@class,'errorsListLink') and normalize-space()='Select a service territory.']",
      "error_service_territory"
    );

    const errorText = (await errorElement.getText()).trim();

    assert.strictEqual(
      errorText,
      "Select a service territory.",
      "No se mostró el mensaje de error de Service Territory."
    );

    const activeStep = await global.helper.findOrFail(
      "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(@class,'slds-assistive-text')]",
      "active_step"
    );

    const stepText = (await activeStep.getText()).toLowerCase();

    assert.strictEqual(
      stepText.includes("location"),
      true,
      "Avanzó de step aunque no se seleccionó Service Territory."
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
