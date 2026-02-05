const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC81 — Validar campo ¿Ha estado en reposo por un tiempo prolongado y siente que ha perdido fuerza para caminar o mantenerse de pie?", function () {
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
      logger.info("\nEjecutando TC81 — Validar campo ¿Ha estado en reposo por un tiempo prolongado y siente que ha perdido fuerza para caminar o mantenerse de pie? | 82 de 105\n");
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

    await global.helper.clickNext(4);

    const reposoSelect = await global.helper.findOrFail(
      "//select[@name='Ha_estado_en_reposo_por_un_tiempo_prolongado_y_siente_que_ha_perdido_fuerza_para']",
      "Campo reposo prolongado y pérdida de fuerza"
    );

    const optionEls = await reposoSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en reposo prolongado\nUI: ${JSON.stringify(uiOptions)}`
    );

    await reposoSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await reposoSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await reposoSelect.findElement(
      By.xpath(".//option[@value='No']")
    );
    await reposoSelect.click();
    await opcionNo.click();

    selectedValue = await reposoSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "No",
      "No se pudo seleccionar la opción 'No'"
    );
  });

  afterEach(async () => {
    if (!global.__runningAll && global.driver) {
      await global.driver.quit();
    }
  });
});