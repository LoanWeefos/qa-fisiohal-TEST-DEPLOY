const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC27 — Pasar Select Location (mínimos obligatorios)", function () {
  this.timeout(0);

  let driver, helper;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC27 — Pasar Select Location | 27 de 50\n");
    }
    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe avanzar al siguiente step al seleccionar un área y dar Next", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1000);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail(
      "//span[contains(@class,'slds-text-heading_medium')]",
      "Áreas"
    );

    const getArea = async (name) => {
      const nameSpan = await global.helper.findOrFail(
        `//span[contains(@class,'slds-text-heading_medium') and normalize-space()='${name}']`,
        "Área " + name
      );

      return await nameSpan.findElement(
        By.xpath("ancestor::div[contains(@class,'slds-visual-picker__figure')]")
      );
    };

    const cubiculoA = await getArea("Cubiculo B");

    const clickArea = async (labelText) => {
      const label = await labelText.findElement(By.xpath("ancestor::label"));

      await global.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
        label
      );
      await global.driver.sleep(600);
    };

    await clickArea(cubiculoA);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.driver.sleep(1200);

    const activeStep = await (
      await global.helper.findOrFail(
        "//lightning-progress-step[contains(@class,'slds-is-active')]//span[contains(@class,'slds-assistive-text')]",
        "Título de etapa activa"
      )
    ).getText();

    assert.strictEqual(
      activeStep.toLowerCase().includes("candidate"),
      true,
      "No avanzó a la siguiente sección después de Select Location"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
