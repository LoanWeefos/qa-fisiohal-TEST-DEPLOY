const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC20 — Validar seleccionar 2 terapias", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC20 — Validar seleccionar 2 terapias | 20 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe deseleccionar la primera terapia al seleccionar la segunda", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );

    const radios = await global.driver.wait(
      until.elementsLocated(
        By.xpath("//input[@type='radio' and @name='verticalPicker']")
      ),
      15000
    );

    assert.ok(radios.length >= 2, "No hay suficientes terapias para validar.");

    const firstRadio = radios[0];
    const secondRadio = radios[1];

    await global.driver.executeScript("arguments[0].click()", firstRadio);
    await global.driver.sleep(500);

    assert.strictEqual(
      await firstRadio.isSelected(),
      true,
      "La primera terapia no quedó seleccionada."
    );

    await global.driver.executeScript("arguments[0].click()", secondRadio);
    await global.driver.sleep(500);

    assert.strictEqual(
      await secondRadio.isSelected(),
      true,
      "La segunda terapia no quedó seleccionada."
    );

    assert.strictEqual(
      await firstRadio.isSelected(),
      false,
      "La primera terapia no se deseleccionó al seleccionar la segunda."
    );
  });

  it("Debe permitir avanzar con solo una terapia seleccionada", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await driver.sleep(1200);

    const activeStep = await (
      await global.helper.findOrFail(
        "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(@class,'slds-assistive-text')]",
        "Título de etapa activa"
      )
    ).getText();

    console.log(activeStep);

    assert.strictEqual(
      activeStep.toLowerCase().includes("location"),
      true,
      "No avanzó al siguiente step después de seleccionar la terapia."
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
