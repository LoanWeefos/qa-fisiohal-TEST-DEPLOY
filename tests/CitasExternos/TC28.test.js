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

describe("TC28 — Validar listado de terapeutas por área seleccionada", function () {
  this.timeout(0);

  const expectedTherapists = [
    "Alinn Rivera",
    "Andrea Severiano",
    "Bertha Bahan",
    "Bruno Espinosa",
    "Bryan Márquez",
    "Cecilia Ramírez",
    "Cynthia Campos",
    "Isis Meneses",
    "Ivonne García",
    "José Carlos Rodríguez",
    "José Luis Salgado",
    "Orlando González",
    "Sashiko Yamamoto",
    "Virgo Jaramillo",
    "Daniela Castro",
  ].map(normalize);

  let driver, helper;

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC28 — Validar listado de terapeutas por área seleccionada | 28 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita - Debe existir el botón 'Agenda Cita' en la página de cuenta"
    );
  });

  it("Debe mostrar la lista correcta de terapeutas según área seleccionada", async () => {
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

    await global.helper.findOrFail(
      "//span[contains(@class,'slds-text-heading_medium')]",
      "Áreas - Debe existir el texto 'Áreas' en la página de agenda cita"
    );

    const cubiculoB = await global.helper.findOrFail(
      "//span[contains(@class,'slds-text-heading_medium') and normalize-space()='Cubiculo B']/ancestor::label",
      "Área Cubículo B - Debe existir el área 'Cubiculo B' en las opciones de áreas del step Select Service Territory"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      cubiculoB
    );
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next - Debe existir el botón 'Next' en la página de agenda cita"
    );
    await global.driver.sleep(1500);

    await global.driver.wait(
      until.elementsLocated(
        By.xpath("//table[contains(@class,'slds-table')]//tbody//tr")
      ),
      15000
    );

    const rows = await global.driver.findElements(
      By.xpath("//table[contains(@class,'slds-table')]//tbody//tr")
    );

    const uiTherapists = [];

    for (const row of rows) {
      const nameCell = await row.findElement(By.xpath(".//th"));
      const name = normalize(await nameCell.getText());
      if (name) uiTherapists.push(name);
    }

    const faltantes = expectedTherapists.filter(
      (t) => !uiTherapists.includes(t)
    );
    const sobrantes = uiTherapists.filter(
      (t) => !expectedTherapists.includes(t)
    );

    const parts = [];
    if (faltantes.length) parts.push(`Faltantes: ${faltantes.join(", ")}`);
    if (sobrantes.length) parts.push(`Sobrantes: ${sobrantes.join(", ")}`);

    assert.strictEqual(
      parts.length,
      0,
      `Diferencias en terapeutas. ${parts.join(" | ")}`
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
