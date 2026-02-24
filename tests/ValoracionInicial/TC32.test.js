const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC32 — Validar campo ¿Cuenta con Receta médica?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
    options: [
      "Si, adjuntar",
      "No",
      "Si, la llevo a la consulta",
    ],
  };

  beforeEach(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC32 — Validar campo ¿Cuenta con Receta médica? | 32 de 105\n");
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

    await global.helper.clickNext(2);

    const recetaSelect = await global.helper.findOrFail(
      "//select[@name='Cuenta_con_Receta_m_dica']",
      "Campo ¿Cuenta con Receta médica? - No se encuentra en el formulario"
    );

    const optionElements = await recetaSelect.findElements(By.xpath(".//option[not(@value='FlowImplicit__DefaultTextChoiceName')]"));

    const uiOptions = [];
    for (const opt of optionElements) {
      uiOptions.push((await opt.getText()).trim());
    }

    assert.deepStrictEqual(
      uiOptions.sort(),
      expected.options.sort(),
      `Opciones incorrectas en ¿Cuenta con Receta médica?\nUI: ${JSON.stringify(uiOptions)}`
    );

    const multipleAttr = await recetaSelect.getAttribute("multiple");
    assert.ok(
      !multipleAttr,
      "El campo permite seleccionar múltiples opciones y no debería"
    );

    await recetaSelect.findElement(
      By.xpath(".//option[normalize-space()='No']")
    ).click();

    const selectedValue = await recetaSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "No",
      "No se pudo seleccionar correctamente una opción del select"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});