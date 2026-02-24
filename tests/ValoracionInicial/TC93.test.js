const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC93 — Validar campo ¿Ha notado si su estrés o estado emocional afecta su dolor o malestar?", function () {
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
      logger.info("\nEjecutando TC93 — Validar campo ¿Ha notado si su estrés o estado emocional afecta su dolor o malestar? | 93 de 105\n");
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

    const estresSelect = await global.helper.findOrFail(
      "//select[@name='Ha_notado_si_su_estr_s_o_estado_emocional_afecta_su_dolor_o_malestar']",
      "Campo Estrés o estado emocional - No se encuentra en el formulario"
    );

    const optionEls = await estresSelect.findElements(
      By.xpath(".//option")
    );

    const uiOptions = [];
    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No", "No estoy seguro"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas\nUI: ${JSON.stringify(uiOptions)}`
    );

    await estresSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await estresSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "estres.Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await estresSelect.findElement(
      By.xpath(".//option[@value='estres.No']")
    );

    await estresSelect.click();
    await opcionNo.click();

    selectedValue = await estresSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "estres.No",
      "No se pudo seleccionar la opción 'No'"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});