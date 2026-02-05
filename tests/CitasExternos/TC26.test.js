const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC26 — Validar selección de 2 áreas", function () {
  this.timeout(0);

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC26 — Validar selección de 2 áreas | 26 de 50\n");
    }

    await global.helper.goToAccount("TEST TEST");
    await global.helper.safeFindAndClick(
      "//button[@name='Account.Agenda_Cita']",
      "Boton Agenda Cita"
    );
  });

  it("Debe deseleccionar la primera área al seleccionar una segunda", async () => {
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

    const cubiculoB = await getArea("Cubiculo B");
    const cubiculoC = await getArea("Cubiculo C");

    const isSelected = async (labelText) => {
      const label = await labelText.findElement(By.xpath("ancestor::label"));

      const check = await label.findElement(
        By.xpath(".//span[contains(@class,'slds-visual-picker__text-check')]")
      );

      return await check.isDisplayed();
    };

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      cubiculoB
    );
    await global.driver.sleep(800);

    assert.strictEqual(
      await isSelected(cubiculoB),
      true,
      "Cubiculo B no quedó seleccionado"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
      cubiculoC
    );
    await global.driver.sleep(800);

    assert.strictEqual(
      await isSelected(cubiculoB),
      false,
      "Cubiculo B NO se deseleccionó al seleccionar Cubiculo C"
    );

    assert.strictEqual(
      await isSelected(cubiculoC),
      true,
      "Cubiculo C no quedó seleccionado"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
