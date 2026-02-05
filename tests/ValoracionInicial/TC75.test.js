const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC75 — Validar campo ¿Ha experimentado episodios de desorientación, confusión o comportamientos que le dificulten mantenerse seguro?", function () {
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
      logger.info("\nEjecutando TC75 — Validar campo ¿Ha experimentado episodios de desorientación, confusión o comportamientos que le dificulten mantenerse seguro? | 75 de 105\n");
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

    const episodiosSelect = await global.helper.findOrFail(
      "//select[@name='Ha_experimentado_episodios_de_desorientaci_n_confusi_n_o_comportamientos_que_le']",
      "Campo episodios de desorientación"
    );

    const optionEls = await episodiosSelect.findElements(By.xpath(".//option"));
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en episodios de desorientación\nUI: ${JSON.stringify(uiOptions)}`
    );

    await episodiosSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await episodiosSelect.getAttribute("value");
    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await episodiosSelect.findElement(
      By.xpath(".//option[@value='No']")
    );
    await episodiosSelect.click();
    await opcionNo.click();

    selectedValue = await episodiosSelect.getAttribute("value");
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