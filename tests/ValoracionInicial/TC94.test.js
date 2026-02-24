const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC94 — Validar campo ¿Cómo describiría su nivel de estrés actualmente?", function () {
  this.timeout(0);

  const expected = {
    AccountName: "TEST TEST",
  };

  before(async () => {
    if (!global.__runningAll) {
      const driver = await loginJwt(
        "/lightning/o/Account/list?filterName=__Recent", "berthabahan@gmail.com.partial"
      );
      global.driver = driver;
      global.helper = new browser(driver);
    } else {
      logger.info("\nEjecutando TC94 — Validar campo ¿Cómo describiría su nivel de estrés actualmente? | 94 de 105\n");
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

    const estresNivelSelect = await global.helper.findOrFail(
      "//select[@name='C_mo_describir_a_su_nivel_de_estr_s_actualmente']",
      "Campo Nivel de Estrés - No se encuentra en el formulario"
    );

    const optionEls = await estresNivelSelect.findElements(
      By.xpath(".//option")
    );

    const uiOptions = [];
    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Bajo", "Moderado", "Alto"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas\nUI: ${JSON.stringify(uiOptions)}`
    );

    await estresNivelSelect.sendKeys("Bajo");
    await global.driver.sleep(300);

    let selectedValue = await estresNivelSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Bajo"),
      "No se pudo seleccionar la opción 'Bajo'"
    );

    const opcionAlto = await estresNivelSelect.findElement(
      By.xpath(".//option[normalize-space()='Alto']")
    );

    await estresNivelSelect.click();
    await opcionAlto.click();
    await global.driver.sleep(300);

    selectedValue = await estresNivelSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Alto"),
      "No se pudo seleccionar la opción 'Alto'"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});