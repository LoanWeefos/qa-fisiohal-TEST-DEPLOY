const assert = require("assert");
const { By, Key } = require("selenium-webdriver");
const loginJwt = require("../../helpers/loginJwt");
const browser = require("../../helpers/browser");
const logger = require("../../helpers/logger");

describe("TC51 — Validar campo ¿Has tenido algún accidente fuerte o un golpe importante?", function () {
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
      logger.info("\nEjecutando TC51 — Validar campo ¿Has tenido algún accidente fuerte o un golpe importante? | 51 de 105\n");
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

    await global.helper.clickNext(3);

    const accidenteSelect = await global.helper.findOrFail(
      "//select[@name='Has_tenido_alg_n_accidente_fuerte_o_un_golpe_importante_como_ca_das_choques_frac']",
      "Campo ¿Has tenido algún accidente fuerte o un golpe importante? - No se encuentra en el formulario"
    );

    const optionEls = await accidenteSelect.findElements(
      By.xpath(".//option")
    );
    const uiOptions = [];

    for (const opt of optionEls) {
      const text = (await opt.getText()).trim();
      if (text && text !== "--None--") uiOptions.push(text);
    }

    const expectedOptions = ["Si", "No"];

    assert.deepStrictEqual(
      uiOptions.sort(),
      expectedOptions.sort(),
      `Opciones incorrectas en ¿Has tenido algún accidente fuerte o un golpe importante?\nUI: ${JSON.stringify(
        uiOptions
      )}`
    );

    await accidenteSelect.sendKeys("Si");
    await global.driver.sleep(300);

    let selectedValue = await accidenteSelect.getAttribute("value");

    assert.strictEqual(
      selectedValue,
      "Si",
      "No se pudo seleccionar la opción 'Si'"
    );

    const opcionNo = await accidenteSelect.findElement(
      By.xpath(".//option[@value='No']")
    );

    await accidenteSelect.click();
    await opcionNo.click();

    selectedValue = await accidenteSelect.getAttribute("value");

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