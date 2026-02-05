const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC43 — Validar Cantidad de Citas con letras", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC43 — Validar Cantidad de Citas con letras | 43 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe mostrar error por Cantidad de Citas inválida", async () => {
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.helper.safeFindAndClick(
      "//span[@title='E Drenaje Linfatico']",
      "Opción terapia E Drenaje Linfatico"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.helper.safeFindAndClick(
      "//span[normalize-space()='Cubiculo B']",
      "Opción Cubiculo B"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas");

    const row = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]",
      "Fila Cecilia Ramirez"
    );

    const radio = await row.findElement(By.xpath(".//input[@type='radio']"));
    await global.driver.executeScript("arguments[0].click()", radio);

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Today']",
      "Boton Today"
    );

    const slots = await global.driver.findElements(
      By.xpath("//span[contains(@class,'slds-radio_faux')]")
    );
    await global.driver.executeScript("arguments[0].click()", slots.at(-1));

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );
    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );

    const toggle = await global.helper.findOrFail(
      "//span[normalize-space()='¿Deseas activar recurrencia?']/ancestor::label//input[@type='checkbox']",
      "Toggle recurrencia"
    );

    await global.driver.executeScript("arguments[0].click()", toggle);

    const input = await global.helper.findOrFail(
      "//input[@name='Cantidad_de_Citas']"
    );

    await input.clear();
    await input.sendKeys("abc");

    await global.helper.safeFindAndClick(
      "//button[normalize-space()='Next']",
      "Boton Next"
    );

    const cantidadError = await global.helper.findOrFail(
      "//span[normalize-space()='Cantidad de Citas']" +
        "/ancestor::flowruntime-screen-field" +
        "//div[contains(@class,'flowruntime-input-error')]",
      "Error Cantidad de Citas"
    );

    const text = await cantidadError.getText();
    assert.ok(text.includes("Please enter some valid input"));
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
