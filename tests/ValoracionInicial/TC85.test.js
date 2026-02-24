const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC85 — Validar campo Dolor EVA", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC85 — Validar campo Dolor EVA | 85 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(5);

    const evaRadios = await global.driver.findElements(
      By.xpath("//fieldset[@role='radiogroup']//input[@type='radio']")
    );

    assert(
      evaRadios.length > 0,
      "No se encontraron opciones de Dolor EVA"
    );

    const evaLabels = await global.driver.findElements(
      By.xpath("//fieldset[@role='radiogroup']//span[@part='formatted-rich-text']")
    );

    const uiOptions = [];
    for (const lbl of evaLabels) {
      const txt = (await lbl.getText()).trim();
      if (txt) uiOptions.push(txt);
    }

    const expectedOptions = [
      "Dolor EVA",
      "0-1",
      "2-3",
      "4-5",
      "6-7",
      "8-9",
      "10",
    ];

    assert.deepStrictEqual(
      uiOptions,
      expectedOptions,
      `Opciones EVA incorrectas\nUI: ${JSON.stringify(uiOptions)}`
    );

    let radioId = await evaRadios[2].getAttribute("id");

    const label45 = await global.driver.findElement(
      By.xpath(`//label[@for='${radioId}']`)
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      label45
    );

    await global.driver.executeScript(
      "arguments[0].click();",
      label45
    );

    await global.driver.sleep(300);

    let selected = 0;
    for (const r of evaRadios) {
      if (await r.isSelected()) selected++;
    }

    assert.strictEqual(
      selected,
      1,
      "Debe existir solo una opción seleccionada"
    );

    radioId = await evaRadios[4].getAttribute("id");

    const label89 = await global.driver.findElement(
      By.xpath(`//label[@for='${radioId}']`)
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      label89
    );

    await global.driver.executeScript(
      "arguments[0].click();",
      label89
    );

    await global.driver.sleep(300);

    selected = 0;
    for (const r of evaRadios) {
      if (await r.isSelected()) selected++;
    }

    assert.strictEqual(
      selected,
      1,
      "Al cambiar selección debe mantenerse una sola opción activa"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});