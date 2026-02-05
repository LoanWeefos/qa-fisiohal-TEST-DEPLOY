const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");


describe("TC08 — Con Área y Terapia: debe permitir agregar", function () {
  this.timeout(0);

  const expected = {
    AccountName: "Test Durán",
    Area: "Piso 1",
    Therapy: "H Fisica",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC08 — Con Área y Terapia: debe permitir agregar | 8 de 36\n");
    }

    await global.helper.goToAccount(expected.AccountName);
    await global.helper.openCreateForm();
  });

  it("Botón Agregar habilitado y al click aumenta la lista de terapias", async () => {
    const areaXpath =
      "//label[contains(.,'Área de Atención')]/following::input[1]";

    await global.helper.safeFindAndClick(areaXpath, "Campo Área de Atención");
    await global.driver.sleep(250);

    const area = await global.helper.findOrFail(
      areaXpath,
      "Campo Área de Atención"
    );

    await area.sendKeys(Key.CONTROL, "a");
    await global.driver.sleep(50);
    await area.sendKeys(Key.BACK_SPACE);
    await global.driver.sleep(150);

    await area.sendKeys(expected.Area);
    await global.driver.sleep(300);

    await global.helper.safeFindAndClick(
      `//lightning-base-combobox-item//span[@title='${expected.Area}']`, `Área ${expected.Area}`
    );
    await global.driver.sleep(250);

    await global.helper.safeFindAndClick("//button[@name='therapy']", "Botón Terapia");
    await global.driver.sleep(250);

    await global.helper.safeFindAndClick(
      `//lightning-base-combobox-item//span[@title='${expected.Therapy}']`, `Opción Terapia ${expected.Therapy}`
    );
    await global.driver.sleep(250);

    const addBtn = await global.helper.findOrFail(
      "//button[normalize-space()='Agregar']",
      "Botón Agregar"
    );

    assert.strictEqual(
      await global.helper.isButtonDisabled(addBtn),
      false
    );

    const before = (
      await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'pill-list')]//span[contains(@class,'slds-pill__label')]"
        )
      )
    ).length;

    await addBtn.click();
    await global.driver.sleep(400);

    const after = (
      await global.driver.findElements(
        By.xpath(
          "//div[contains(@class,'pill-list')]//span[contains(@class,'slds-pill__label')]"
        )
      )
    ).length;

    assert.ok(after > before);
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) await global.driver.quit();
  });
});
