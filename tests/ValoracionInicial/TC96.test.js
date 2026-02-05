const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC96 — Validar campo ¿Cree que la falta de sueño ha empeorado su padecimiento?", function () {
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
      logger.info("\nEjecutando TC96 — Validar campo ¿Cree que la falta de sueño ha empeorado su padecimiento? | 96 de 105\n");
    }

    await global.helper.goToAccountBySearch(expected.AccountName);
    await global.helper.openFirstAppointment();
  });

  it("Comprobar elementos en el campo y solo elegir 1 elemento", async () => {
    await global.helper.safeFindAndClick(
      "//lightning-icon[@title='Primera vez']/ancestor::span[contains(@class,'slds-visual-picker__figure')]",
      "Opción Primera vez"
    );

    await global.driver.sleep(2000);

    await global.helper.clickNext(5);

    const faltaSuenoSelect = await global.helper.findOrFail(
      "//select[@name='Cree_que_la_falta_de_sue_o_ha_empeorado_su_padecimiento']",
      "Campo Falta de Sueño"
    );

    const optionEls = await faltaSuenoSelect.findElements(By.xpath(".//option"));
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

    await faltaSuenoSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await faltaSuenoSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("Si"),
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNoSeguro = await faltaSuenoSelect.findElement(
      By.xpath(".//option[normalize-space()='No estoy seguro']")
    );

    await faltaSuenoSelect.click();
    await opcionNoSeguro.click();
    await global.driver.sleep(300);

    selectedValue = await faltaSuenoSelect.getAttribute("value");
    assert.ok(
      selectedValue.includes("No estoy seguro"),
      "No se pudo seleccionar la opción 'No estoy seguro'"
    );
  });

  after(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});