const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC23 — Validar campo Durante su terapia, ¿Le gustaría conversar?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
    seleccionar: "Feliz de platicar",
  };

  const EXPECTED_OPTIONS = [
    "Prefiero estar en silencio",
    "Feliz de platicar",
  ];

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "ehaiden@fisiohal.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC23 — Validar campo Durante su terapia, ¿Le gustaría conversar? | 23 de 105\n");
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

    const selectElement = await global.helper.findOrFail(
      "//select[@name='Durante_su_terapia_Le_gustar_a_conversar']",
      "Campo ¿Le gustaría conversar? - No se encuentra en el formulario"
    );

    const optionElements = await selectElement.findElements(By.xpath("./option"));

    const uiOptions = [];
    for (const opt of optionElements) {
      const txt = (await opt.getText()).trim();
      if (txt && txt !== "--None--") uiOptions.push(txt);
    }

    assert.deepStrictEqual(
      uiOptions,
      EXPECTED_OPTIONS,
      `Opciones incorrectas.\nUI: ${uiOptions.join(" | ")}`
    );

    const optionToPick = await selectElement.findElement(
      By.xpath("./option[normalize-space()='" + expected.seleccionar + "']")
    );
    const valueToPick = await optionToPick.getAttribute("value");

    await selectElement.sendKeys(valueToPick);

    const selectedValue = await selectElement.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      valueToPick,
      "No se seleccionó correctamente la opción"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});