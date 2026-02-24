const assert = require("assert");
const { By, until, Key } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

describe("TC24 — Mostrar lista de áreas vacía al borrar dirección", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC24 — Mostrar lista de áreas vacía al borrar dirección | 24 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe dejar la lista de áreas vacía al borrar la dirección seleccionada", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1000);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico - Debe existir la opción de terapia 'E Drenaje Linfatico' en el step Select Topic"
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    const readAreas = async () => {
      const cards = await global.driver.findElements(
        By.xpath("//span[contains(@class,'slds-text-heading_medium')]")
      );

      const list = [];
      for (const card of cards) {
        list.push(normalize(await card.getText()));
      }
      return list;
    };

    const addressInput = await global.helper.findOrFail(
      "//div[contains(@class,'runtime_appointmentbookingFlowLocation')]//input[contains(@class,'uiInputTextForAutocomplete') and @role='combobox']",
      "Input de dirección - Debe existir el input de dirección en el step Select Service Territory"
    );

    await addressInput.sendKeys("a");
    await global.driver.sleep(1200);

    await addressInput.sendKeys(Key.SPACE);
    await addressInput.sendKeys(Key.BACK_SPACE);

    await global.helper.safeFindAndClick(
      "(//a[@role='option'])[1]",
      "Primera opción de dirección - Debe existir la primera opción de dirección en el step Select Service Territory"
    );
    await global.driver.sleep(1500);

    await addressInput.sendKeys(Key.CONTROL, "a");
    await addressInput.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(1500);

    const areasAfterClear = await readAreas();

    if (areasAfterClear.length === 0) {
      const emptyMsg = await global.helper.findOrFail(
        "//p[contains(.,'No results for that Work Type Group')]",
        "Mensaje No results - Debe mostrar mensaje 'No results for that Work Type Group' cuando se borra la dirección"
      );

      assert.ok(
        emptyMsg,
        "Mensaje 'No results' no se muestra al quedar la lista vacía"
      );

      return;
    }

    assert.fail(
      `La lista NO quedó vacía. Salesforce mostró ${areasAfterClear.length} áreas`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
