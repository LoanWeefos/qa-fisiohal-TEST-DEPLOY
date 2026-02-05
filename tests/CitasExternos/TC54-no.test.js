//OMITIR POR CAMBIO DE FLUJO

const assert = require("assert");
const { By } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC49 — Validar campo obligatorio ¿Agregar otro material?", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt();
      global.driver = driver;
      global.helper = new browser(driver);
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']"
    );
  });

  it("Debe mostrar error y no permitir avanzar si no se selecciona ¿Agregar otro material?", async () => {
    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(800);

    await global.helper.safeFindAndClick(
      "//span[contains(@class,'slds-visual-picker__figure')]//span[@title='E Drenaje Linfatico']"
    );
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick("//span[normalize-space()='Cubiculo B']");
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1500);

    await global.helper.findOrFail("//tbody/tr", "Tabla terapeutas", 20000);

    const rowCecilia = await global.helper.findOrFail(
      "//tbody/tr[.//lightning-base-formatted-text[normalize-space()='Cecilia Ramirez']]"
    );

    const therapistRadio = await rowCecilia.findElement(
      By.xpath(".//input[@type='radio']")
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      therapistRadio
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(2000);

    await global.helper.safeFindAndClick("//button[normalize-space()='Today']");
    await global.driver.sleep(1200);

    let columns = [];
    const start = Date.now();
    while (columns.length < 2 && Date.now() - start < 25000) {
      columns = await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'slds-col')]//div[@id='timeSlots']/ancestor::div[contains(@class,'slds-col')]"
        )
      );
      if (columns.length < 2) await global.driver.sleep(300);
    }

    assert.ok(columns.length >= 2);

    const targetColumn = columns[1];

    const slots = await targetColumn.findElements(
      By.xpath(".//span[contains(@class,'slds-radio_faux')]")
    );

    assert.ok(slots.length > 0);

    const lastSlot = slots[slots.length - 1];

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      lastSlot
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1500);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    const yesRadio = await global.helper.findOrFail(
      "//input[@type='radio' and @value='SI']"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      yesRadio
    );
    await global.driver.sleep(600);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    const materialSelect = await global.helper.findOrFail(
      "//select[@name='materialSeleccionado']"
    );

    await materialSelect.sendKeys("Gasas");
    await global.driver.sleep(500);

    const cantidadInput = await global.helper.findOrFail(
      "//input[@name='Cantidad_usada']"
    );

    await cantidadInput.clear();
    await cantidadInput.sendKeys("1");
    await global.driver.sleep(500);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    await global.helper.safeFindAndClick("//button[normalize-space()='Next']");
    await global.driver.sleep(1200);

    const errorMessage = await global.helper.findOrFail(
      "//*[contains(text(),'Please select a choice')]"
    );

    const errorText = await errorMessage.getText();

    assert.ok(errorText.includes("Please select a choice"));
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
