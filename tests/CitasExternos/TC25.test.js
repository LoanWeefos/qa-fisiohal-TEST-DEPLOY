const assert = require("assert");
const { By, until, Key } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC25 — Validar filtro de dirección", function () {
  this.timeout(0);

  const ADDRESS =
    "Bosque de Bugambilias 111-199, Bosques de las Lomas, Cuajimalpa de Morelos, 05120 Ciudad de México, CDMX";

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC25 — Validar filtro de dirección | 25 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe actualizar las distancias al ingresar una dirección cercana", async () => {
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

    const readFirstDistance = async () => {
      const distanceElement = await global.helper.findOrFail(
        "(//span[contains(@class,'slds-text-title')]//span[contains(@class,'uiOutputNumber')])[1]",
        "Texto distancia"
      );

      return (await distanceElement.getText()).trim();
    };

    const initialDistance = await readFirstDistance();

    const addressInput = await global.helper.findOrFail(
      "//div[contains(@class,'runtime_appointmentbookingFlowLocation')]//input[contains(@class,'uiInputTextForAutocomplete') and @role='combobox']",
      "Campo de dirección"
    );

    await global.driver.executeScript(
      "arguments[0].focus(); arguments[0].value=''; arguments[0].dispatchEvent(new Event('input',{bubbles:true}));",
      addressInput
    );
    await global.driver.sleep(300);

    await global.driver.executeScript(
      `
      arguments[0].focus();
      arguments[0].value = arguments[1];
      arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
      arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
      `,
      addressInput,
      ADDRESS
    );
    await global.driver.sleep(1500);

    await global.helper.findOrFail(
      "//*[@role='option']",
      "Opciones de dirección"
    );

    await global.helper.safeFindAndClick(
      "(//*[@role='option'])[1]",
      "Primera opción de dirección"
    );
    await global.driver.sleep(2000);

    const updatedDistance = await readFirstDistance();

    assert.notStrictEqual(
      updatedDistance,
      initialDistance,
      "La distancia NO se actualizó al cambiar la dirección"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
