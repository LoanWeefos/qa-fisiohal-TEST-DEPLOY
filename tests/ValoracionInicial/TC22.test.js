const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC22 — Validar campo Elija la intensidad de la luz de su preferencia", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
    opciones: ["Alto", "Medio", "Bajo", "Indiferente"],
    seleccionar: "Medio",
  };
  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC22 — Validar campo Elija la intensidad de la luz de su preferencia | 22 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos de la lista y solo puede elegir 1 elemento de la lista", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez - Debe existir un botón para seleccionar que es la primera vez del paciente"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(1);

    const luzBtn = await global.helper.findOrFail(
      "//button[@aria-label='Elija la intensidad de la luz preferente']",
      "Campo Intensidad de la luz - No se encuentra en el formulario"
    );

    await global.driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      luzBtn
    );
    await global.driver.sleep(300);

    await global.driver.executeScript(
      "arguments[0].click();",
      luzBtn
    );

    await global.helper.findOrFail("//div[@role='listbox']//lightning-base-combobox-item[@role='option']", "Opciones del campo Intensidad de la luz");

    const optionElements = await global.driver.findElements(
      By.xpath("//div[@role='listbox']//lightning-base-combobox-item[@role='option']")
    );

    const uiOptions = [];
    for (const opt of optionElements) {
      const spans = await opt.findElements(By.xpath(".//span[@title]"));
      if (spans.length) {
        const txt = (await spans[0].getText()).trim();
        if (txt !== "--None--") {
          uiOptions.push(txt);
        }
      }
    }

    assert.deepStrictEqual(
      uiOptions.sort(),
      expected.opciones.sort(),
      `Opciones incorrectas en Intensidad de la luz.\nUI: ${uiOptions.join(", ")}`
    );

    await global.helper.safeFindAndClick(
      `//div[@role='listbox']//span[@title='${expected.seleccionar}']`,
      `Opción ${expected.seleccionar} - No se encuentra la opción ${expected.seleccionar} en el campo Intensidad de la luz`
    );

    const selectedText = await luzBtn
      .findElement(By.xpath(".//span[contains(@class,'slds-truncate')]"))
      .getText();

    assert.strictEqual(
      selectedText.trim(),
      expected.seleccionar,
      "La opción seleccionada no es correcta"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});