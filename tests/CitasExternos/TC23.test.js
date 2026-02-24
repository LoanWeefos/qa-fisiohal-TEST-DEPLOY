const assert = require("assert");
const { By, until } = require("selenium-webdriver");

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

describe("TC23 — Validar listado de áreas por terapia seleccionada", function () {
  this.timeout(0);

  const expectedAreas = [
    // "Cubículo A",
    "Cubículo B",
    "Cubículo C",
    // "Cubículo D",
    "Cubículo E",
    "Cubículo F",
    "Cubículo G",
    "Cubículo H",
    "Cubículo I",
    "Cubículo J",
    "Cubículo K",
  ].map(normalize);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC23 — Validar listado de áreas por terapia seleccionada | 23 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");

    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar solo las áreas válidas para la terapia seleccionada", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick(
      "(//div[contains(@class,'runtime_appointmentbookingVisualPickerCard')]//label)[1]",
      "Primer card de terapia - Debe existir el primer card de terapia en el step Select Topic"
    );

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico - Debe existir la opción de terapia 'E Drenaje Linfatico' en el step Select Topic"
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    const cards = await global.driver.wait(
      until.elementsLocated(
        By.xpath("//span[contains(@class,'slds-text-heading_medium')]")
      ),
      15000
    );

    const uiAreasRaw = [];
    for (const area of cards) {
      uiAreasRaw.push(await area.getText());
    }

    const uiAreas = uiAreasRaw.map(normalize);

    const faltantes = expectedAreas.filter((a) => !uiAreas.includes(a));
    const sobrantes = uiAreas.filter((a) => !expectedAreas.includes(a));
    const coinciden = uiAreas.filter((a) => expectedAreas.includes(a));

    console.log("COINCIDEN (" + coinciden.length + "):");
    coinciden.forEach((a) => console.log("  ✓", a));

    console.log("\nFALTANTES (" + faltantes.length + "):");
    faltantes.forEach((a) => console.log("  -", a));

    console.log("\nSOBRANTES (" + sobrantes.length + "):");
    sobrantes.forEach((a) => console.log("  +", a));

    assert.strictEqual(
      faltantes.length === 0 && sobrantes.length === 0,
      true,
      "El listado de cubículos no coincide con lo esperado para la terapia"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
